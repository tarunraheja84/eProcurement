'use client'
import { Order } from '@/types/order'
import { convertDateTime, getPermissions, prevBackButtonColors } from '@/utils/helperFrontendFunctions'
import { OrderStatus, PaymentType } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import {
    subDays,
    startOfDay,
    endOfDay,
} from 'date-fns';
import DateRangePicker from '../common_components/DateRangePicker'
import AccessDenied from '@/app/access_denied/page'
interface Props {
    paymentType: PaymentType,
    orders: Order[],
    ordersCount: number,
}

const Payments = (props: Props) => {
    const router = useRouter();
    const isPrepaid = props.paymentType === PaymentType.PREPAID
    const [orders, setOrders] = useState<Order[]>(props.orders)
    const today = new Date();
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [isAllSelected, setIsAllSelected] = useState<boolean>(false)
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalPages, setTotalPages] = useState(Math.ceil(props.ordersCount / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
    const [currentPageOrders, setCurrentPageOrders] = useState<Order[]>(props.orders)
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(startOfDay(subDays(today, 6)));
    const [endDate, setEndDate] = useState<Date | null>(endOfDay(today));
    const [status, setStatus] = useState<string>("");
    const [confirmedOrderFound, setConfirmedOrderFound] = useState<boolean>(false);
    const [isPrepaidPayment, setIsPrepaidPayment] = useState<boolean>(true);
    const paymentData = {
        refId: '',
        paymentMethod: 'UPI',
        amount: 0,
        paymentDate: '',
        paymentType : '',
    }
    const [paymentDetails, setPaymentDetails] = useState(paymentData);

    const openPopup = () => {
        setPopupOpen(true);
    };

    useEffect(() => {
        if (isPopupOpen){
            setIsPrepaidPayment(true);
            setConfirmedOrderFound(false);
            setPaymentDetails({ ...paymentData}); // Example of resetting payment details
        }
    }, [isPopupOpen]);

    const closePopup = () => {
        setPopupOpen(false);
    };

    const handleInputChange = (e: any) => {
        const { id, value } = e.target;
        if (value === "") setIsPrepaidPayment(true)
        if (value === "POSTPAID" || value === "PREPAID") {
            verifyOrdersStatus(value)
            if (value === "POSTPAID") setIsPrepaidPayment(false)
            if (value === "PREPAID") setIsPrepaidPayment(true)
        }
        setPaymentDetails((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    function verifyOrdersStatus(value: any) {
        if (value === "POSTPAID"){
            let isConfirmedOrderSelected = false;
            orders.map((order : Order) => {
                if (selectedOrders.includes(order.orderId!)){
                    if (order.status === OrderStatus.CONFIRMED) {
                        isConfirmedOrderSelected = true;
                        setConfirmedOrderFound(true)
                        return;
                    }
                }
            })
        }else if (value === "PREPAID"){
            setConfirmedOrderFound(false)
        }

    }
    

    const onSubmitForm = async (e: any) => {
        e.preventDefault();
        paymentDetails.amount = total
        try {
            if (paymentDetails.paymentType === "PREPAID") {
                await axios.post('/api/orders/payment/prepaid', {orderIds : selectedOrders, paymentData : paymentDetails})
                alert("payment successful!")
                location.reload();
            }else if (paymentDetails.paymentType === "POSTPAID"){
                const paymentData = {
                    "amount": total * 100,
                    "currency": "INR",
                    "receipt": "receipt#1",
                    "notes": {
                        "orderIds": selectedOrders.toString()
                    }
                }
                const result = await axios.post("/api/create_cxo_txn", {orderIds : selectedOrders, paymentData})

                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = async () => {
                try {
                    var options = {
                    key: "rzp_test_VH8sGCX5O347cE",
                    // key: _remoteConfig.razopay_key,
                    // int.parse(((amount * 100)-usedPoints).toStringAsFixed(0))
                    amount: parseInt((total * 100).toFixed(0)), ///only two decimal places required
                    // "amount": int.parse((amount * 100).toStringAsFixed(0)),///only two decimal places required
                    name: "RedBasil",
                    order_id: result.data["pgOrderId"],
                    //"description": "Fine potatoes",
                    prefill: {
                        contact: "+911234512345",
                        email: "ritesh.singla36@gmail.com",
                    },
                    notes : {
                        source : "e-procurement"
                    },
                    timeout: 900,
                    theme: { color: "#EC3A45", backdrop_color: "#FFFFFF" },
                    handler: async function (response: any) {
                        // toast("payment Successful, with payment Id: " + response.razorpay_payment_id);
                        // setTimeout(() => {
                        //   window.location.reload();
                        // }, 5000)
                        const paymentId = response.razorpay_payment_id;
                        const cxoTxnId = result.data["cxoTxnId"];
                        await axios.post('/api/orders/payment/postpaid', {orderIds : selectedOrders, paymentId, cxoTxnId});
                        alert("payment successful!")
                        location.reload();
                    },
                    modal: {
                        "ondismiss": function(){
                            alert("payment cancelled!")
                        }
                    }
                    //"image":"https://apps-prod-dd0a0.web.app/img/master/categories/freshfruits/freshfruits.jpg"
                    };
                    const paymentObject = new (window as any).Razorpay(options);
                    paymentObject.open();
                    paymentObject.on("payment.failed", function (response: any) {
                        alert("payment failed!")
                    });
                } catch (error: any) {
                    alert(`catch wala error ${error.message}`);
                }
                };
    
                document.body.appendChild(script);
            }
        } catch (error) {
            console.log('error :>> ', error);
            alert("payment failed!")
        }
    };

    const PopupDialog = ({ isOpen, onClose }: any) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg border-4 shadow-lg">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    {confirmedOrderFound ? <p className='text-xs text-custom-red'>* Please prepay or remove the confirmed order among the selected ones for payment. *</p> : <p className='text-xs text-custom-red'>*For postpaid payment, only the orders that have been delivered should be chosen.*</p>}
                    <h2 className="text-2xl font-semibold text-custom-gray-5 mb-4 text-center">Payment Details</h2>
                    <form className='flex flex-col justify-center gap-4' onSubmit={onSubmitForm}>
                        <div className='flex justify-between'>

                            <label htmlFor="paymentType">Payment Type :</label>
                            <select
                                id="paymentType"
                                defaultValue={paymentDetails.paymentType}
                                onChange={handleInputChange}
                                className="border-2 border-custom-theme solid w-60 text-center rounded"
                                required
                            >
                                <option value="">SELECT</option>
                                <option value="PREPAID">PREPAID</option>
                                <option value="POSTPAID">POSTPAID</option>
                                {/* Add more payment methods as needed */}
                            </select>

                        </div>
                        {isPrepaidPayment &&
                            <>
                        <div className='flex justify-between'>
                            <label htmlFor="refId">Ref ID :</label>
                            <input
                                id="refId"
                                type="text"
                                onBlur={handleInputChange}
                                defaultValue={paymentDetails.refId}
                                className="border-2 border-custom-theme solid w-60 text-center rounded"
                                required
                            />
                        </div>

                        <div className='flex justify-between'>

                            <label htmlFor="paymentMethod">Payment Method :</label>
                            <select
                                id="paymentMethod"
                                defaultValue={paymentDetails.paymentMethod}
                                onBlur={handleInputChange}
                                className="border-2 border-custom-theme solid w-60 text-center rounded"
                                required
                            >
                                <option value="UPI">UPI</option>
                                <option value="NEFT">NEFT</option>
                                <option value="RTGS">RTGS</option>
                                <option value="IMPS">IMPS</option>
                            </select>

                        </div>
                        
                        <div className='flex justify-between'>

                            <label htmlFor="paymentDate">Payment Date :</label>
                            <input
                                id="paymentDate"
                                type="datetime-local"
                                defaultValue={paymentDetails.paymentDate}
                                onBlur={handleInputChange}
                                className="border-2 border-custom-theme solid w-60 text-center rounded"
                                required
                            />
                        </div>
                        </>
                        }
                        <div className='flex justify-between'>

                            <label htmlFor="amount">Amount (₹) :</label>
                            <input
                                id="amount"
                                type="number"
                                defaultValue={total}
                                onChange={handleInputChange}
                                className="solid w-60 text-center rounded"
                                required
                                disabled={true}
                            />
                        </div>
                        <div className='flex justify-between '>
                            <button
                                type="submit"
                                className={`mt-6 px-4 py-2 ${confirmedOrderFound ? "bg-custom-gray-4 pointer-events-none":"bg-custom-theme"} text-custom-buttonText rounded-md hover:bg-hover-theme`}
                            >
                                {`${isPrepaidPayment ? "Submit Payment Details" : "Pay Now"}`}
                            </button>
                            <div
                                className="mt-6 px-4 py-2 bg-custom-red text-custom-buttonText rounded-md hover:bg-hover-red cursor-pointer"
                                onClick={closePopup}
                            >
                                Cancel
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        );
    };

    const toggleOrderSelection = (orderId: string) => {
        orders.map((order: Order) => {
            if (order.orderId === orderId) {
                if (selectedOrders.includes(orderId)) {
                    setTotal(total - order.total)
                } else {
                    setTotal(total + order.total)

                }
            }
        })
        if (selectedOrders.includes(orderId)) {
            const index = selectedOrders.indexOf(orderId);
            if (index > -1) { // only splice array when item is found
                selectedOrders.splice(index, 1); // 2nd parameter means remove one item only
            }
            setSelectedOrders(selectedOrders);
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };

    function handlePayNow(): void {
        openPopup();
    }

    function handleSelectAll() {
        if (isAllSelected) {
            setSelectedOrders([]);
            setTotal(0);
            setIsAllSelected(false);
        } else {
            let orderIds: string[] = [];
            let orderTotal = 0;
            for (let order of orders) {
                if (!selectedOrders.includes(order.orderId!)) {
                    orderIds.push(order.orderId!);
                }
                orderTotal = orderTotal + order.total;
            }
            setTotal(orderTotal);
            setSelectedOrders(orderIds);
            setIsAllSelected(true);
        }
    }

    const showLastQuotations = async (page: number) => {
        const skip = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1);
        const take = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE);
        setCurrentPageOrders(orders.slice(skip, skip + take));

        setPageNumber(page);
    }

    const fetchQuotations = async () => {
        try {
            const result = await axios.post(`/api/orders/read`, { page: pageNumber, status: isPrepaid ? OrderStatus.CONFIRMED : OrderStatus.DELIVERED })
            const ordersToAdd = result.data.filter((newOrder: Order) => {
                return !orders.some(existingOrder => existingOrder.orderId === newOrder.orderId);
            });
            if (ordersToAdd.length > 0) {
                setOrders((prev: Order[]) => [...prev, ...ordersToAdd]);
            }
            setCurrentPageOrders([...result.data])
            setPageNumber(pageNumber + 1)
        }
        catch (error) {
            console.log('error  :>> ', error);
        }
    }

    const applyFilters = async () => {
        try {
            const [result, totalFilteredPages] = await Promise.all([axios.post(`/api/orders/read`, { page: 1, startDate: startDate, endDate: endDate, status: status }),
            axios.post(`/api/orders/read`, { startDate: startDate, endDate: endDate, status: status, count: true })
            ]);
            const ordersToAdd = result.data.filter((newOrder: Order) => {
                return !orders.some(existingOrder => existingOrder.orderId === newOrder.orderId);
            });
            setCurrentPageOrders([...result.data])
            setTotalPages(Math.ceil(totalFilteredPages.data.count / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
            setPageNumber(1)
            if (ordersToAdd.length > 0) {
                setOrders((prev: Order[]) => [...prev, ...ordersToAdd]);
            }
        }
        catch (error) {
            console.log('error  :>> ', error);
        }
    }

    useEffect(() => {
        prevBackButtonColors(pageNumber, totalPages);
    }, [currentPageOrders])


    return (
        <>
         {getPermissions("paymentPermissions","edit") ? <>
            {/* filters */}
            <div className="flex flex-col md:flex-row justify-between p-4 md:py-2 my-4 rounded-md bg-custom-gray-3 space-y-4 md:space-y-0">

                <div className={`flex flex-col md:flex-row justify-center md:items-center space-y-4 md:space-y-0 md:space-x-4`}>
                    <div>
                        <label className="text-sm font-medium text-custom-gray-5">Start Date: </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => {
                                setStartDate(date as Date);
                                const dateRange = document.getElementById("dateRange");
                                if (dateRange) {
                                    const customOption = dateRange.querySelector('option[value="custom"]');
                                    if (customOption) {
                                        (customOption as any).selected = true;
                                    }
                                }
                            }}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="MMMM d, yyyy"
                            className="w-full px-2 border rounded-md cursor-pointer outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-custom-gray-5">End Date: </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => {
                                setEndDate(date as Date);
                                const dateRange = document.getElementById("dateRange");
                                if (dateRange) {
                                    const customOption = dateRange.querySelector('option[value="custom"]');
                                    if (customOption) {
                                        (customOption as any).selected = true;
                                    }
                                }
                            }}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="MMMM d, yyyy"
                            className="w-full px-2 border rounded-md cursor-pointer outline-none"
                        />
                    </div>

                </div>

                <div className="flex flex-col md:flex-row my-auto space-y-4 md:space-y-0">
                    <div className="my-auto">
                        <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Date Range: </label>
                        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
                    </div>

                    <div className="my-auto xl:pt-2">
                        <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Status: </label>
                        <select
                            className="md:ml-2 focus:outline-none cursor-pointer rounded-md"
                            onChange={(e) => {
                                setStatus(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value={OrderStatus.CONFIRMED}>CONFIRMED</option>
                            <option value={OrderStatus.DELIVERED}>DELIVERED</option>
                        </select>
                    </div>

                    <div className="my-auto flex items-center justify-center ">
                        <div className="h-fit md:ml-4 p-2 mt-2 md:mt-0 bg-custom-theme hover:bg-hover-theme text-custom-buttonText rounded-md outline-none cursor-pointer"
                            onClick={applyFilters}>
                            Apply&nbsp;Filters
                        </div>
                    </div>

                </div>
            </div>
            <PopupDialog isOpen={isPopupOpen} onClose={closePopup} />
            <div className={`flex justify-between items-center pb-4 mb-2 sticky top-[3rem] z-[18] p-[1rem] bg-custom-gray-2 border-4 shadow-lg flex-wrap`}>
                <div>
                    <div className="text-xl font-bold ">Orders Payment</div>
                </div>
                <div>
                    <div className="text-xl font-bold float-right">Total Amount to Pay: ₹ <span className='text-custom-green'>{total}</span></div>
                </div>
                <Button className={`bg-custom-theme px-5 py-3 text-custom-buttonText shadow-lg ${total <= 0 ? "bg-custom-gray-3 pointer-events-none" : ""}`} onClick={handlePayNow}>Pay Now</Button>
            </div>
            {orders.length > 0 ? <>
                <div className="flex justify-end items-center">
                    <label className="relative flex items-center p-3 rounded-full cursor-pointer" onClick={() => { handleSelectAll() }} htmlFor="checkbox" >Select All
                        <input type="checkbox"
                            className="ml-2 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-custom-gray-1 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-custom-gray-5 checked:bg-custom-gray-5 checked:before:bg-custom-gray-5 hover:before:opacity-10"
                            id="checkbox" checked={isAllSelected} />
                        <span
                            className="absolute text-custom-buttonText transition-opacity opacity-0 pointer-events-none top-2/4 left-[100px] -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                stroke="currentColor" strokeWidth="1">
                                <path fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"></path>
                            </svg>
                        </span>
                    </label>
                </div>
                <div >

                    {currentPageOrders.length > 0 && currentPageOrders.map((order: Order, index) => (
                        <div
                            className={`rounded-lg shadow-md m-4 bg-white cursor-pointer ${selectedOrders.includes(order.orderId!) ? 'border-2 border-custom-theme' : ''
                                }`}
                            key={index}
                            onClick={() => toggleOrderSelection(order.orderId!)}
                        >
                            <div className="flex justify-between items-center border rounded-lg p-3 bg-custom-gray-1 border-custom-gray-2">
                                <div className="flex flex-col">
                                    <h2 className="font-bold text-custom-red text-sm">Order ID: {order.orderId}</h2>
                                    {order.status === OrderStatus.DELIVERED && <p className="text-custom-gray-4 text-xs">Delivery Date: {convertDateTime(order.deliveryDate!.toString())}</p>}
                                    <p className="text-custom-gray-4 text-xs">Order Date: {convertDateTime(order.createdAt!.toString())}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-custom-gray-4 text-xs">Status: {order.status}</p>
                                    <p className="text-custom-gray-4 text-xs">Total: <span className='text-custom-green'>₹{order.total}</span></p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-custom-theme"
                                        checked={selectedOrders.includes(order.orderId!)}
                                        onChange={() => { }}
                                    />
                                    <a href={`/orders/${order.orderId}`} target="_blank" rel="noopener noreferrer" className="text-custom-blue font-semibold hover:underline text-xs">View</a>
                                </div>
                            </div>
                            {/* Add more order details or components here if needed */}
                        </div>
                    ))}
                </div>

                <div className="flex flex-row-reverse">Page {pageNumber}/{totalPages}</div>
                <div className="flex justify-end gap-2 mt-2">
                    <button id="prevButton" className="bg-custom-theme text-custom-buttonText px-3 py-2 rounded-md" onClick={() => {
                        if (pageNumber > 1) showLastQuotations(pageNumber - 1);
                    }}>← Prev</button>
                    <button id="nextButton" className="bg-custom-theme text-custom-buttonText px-3 py-2 rounded-md" onClick={() => {
                        if (pageNumber < totalPages) fetchQuotations();
                    }}>Next →</button>
                </div>
            </> :
                <div>
                    No Orders Found!
                </div>
            }

            </>:<AccessDenied />}
        </>
    )

}

export default Payments

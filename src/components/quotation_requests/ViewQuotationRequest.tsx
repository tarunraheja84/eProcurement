"use client"
import React, { useState, ChangeEventHandler } from 'react';
import { Product } from '@/types/product';
import { Pricing, QuotationRequestStatus, Vendor } from '@prisma/client';
import { convertDateTime, GetPermissions, quotationRequestStatusColor } from '@/utils/helperFrontendFunctions';
import Loading from '@/app/loading';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useSession } from 'next-auth/react';
import { UserType } from '@/types/enums';
import { useRouter } from 'next/navigation';
import AccessDenied from '@/app/access_denied/page';


type Props = {
    quotationRequest: any,
    vendorIdQuotationsMap?: any
}

const ViewQuotationRequest = ({ quotationRequest, vendorIdQuotationsMap }: Props) => {
    const [loading, setLoading] = useState(false);
    const [expiryDate, setExpiryDate] = useState(quotationRequest.expiryDate);
    const [edit, setEdit] = useState(false);
    const [productQuantityMap, setProductQuantityMap] = useState(new Map());
    const session: UserSession | undefined = useSession().data?.user;
    const isVendorLogin = session?.userType === UserType.VENDOR_USER ? true : false;
    const router = useRouter();

    const handleQuantityChange = (sellerProductId: string): ChangeEventHandler<HTMLInputElement> => (e) => {
        const { value } = e.target;
        const updatedProductQuantityMap = new Map(productQuantityMap);
        updatedProductQuantityMap.set(sellerProductId, Number(value));
        setProductQuantityMap(updatedProductQuantityMap);
    };

    const updateQuotationRequest = async () => {
        const flag = confirm("Are you sure?");
        if (!flag) return;

        const vendorIds = quotationRequest.vendors?.map((vendor: any) => vendor.vendorId!);
        let quotationRequestProducts: { [key: string]: number } = {};
        productQuantityMap.forEach((value: number, key: string) => {
            if(value)
                quotationRequestProducts[key] = value;
        });

        const newQuotationRequest = {
            quotationRequestId: quotationRequest.quotationRequestId,
            quotationRequestName: quotationRequest.quotationRequestName,
            procurementId: quotationRequest.procurementId,
            status: quotationRequest.status,
            pricing: quotationRequest.pricing,
            expiryDate: expiryDate,
            quotationRequestProducts: quotationRequestProducts,
            productIds: quotationRequest.productIds,
            vendorIds: vendorIds
        };

        try {
            await Promise.all([axios.post("/api/quotation_requests/create", { quotationReq: newQuotationRequest, vendorsIdList: vendorIds }), axios.put("/api/quotation_requests/update", { quotationReq: { productIds: quotationRequest.productIds, quotationRequestProducts: quotationRequestProducts, status: QuotationRequestStatus.VOID }, quotationRequestId: quotationRequest.quotationRequestId })]);
            alert("Quotation Request updated successfully")
        } catch (error) {
            console.log('error :>> ', error);
        }
        window.open("/quotation_requests/all_quotation_requests", "_self");
    }

    async function handleVoidQuotReq(): Promise<void> {
        const flag = confirm("Are you sure?");
        if (!flag) return;
        setLoading(true);

        let quotationRequestProducts: { [key: string]: number } = {};
        productQuantityMap.forEach((value: number, key: string) => {
            quotationRequestProducts[key] = value;
        });

        try {
            await Promise.all([axios.put("/api/quotation_requests/update", { quotationReq: { productIds: quotationRequest.productIds, quotationRequestProducts: quotationRequestProducts, status: QuotationRequestStatus.VOID }, quotationRequestId: quotationRequest.quotationRequestId })])
            alert("Quotation request updated successfully!")
        } catch (error) {
            console.log('error :>> ', error);
        }
        window.open("/quotation_requests/all_quotation_requests", "_self");
        setLoading(false);
    }

    return (<>
        {GetPermissions("quotationRequestPermissions", "view") ? loading ?
            < Loading /> :
            <>
                <h1 className="text-2xl font-bold text-custom-theme mb-4">Quotation Request Details</h1>
                <hr className="border-custom-theme border mb-4" />

                <div className="flex flex-col md:flex-row gap-2 justify-end items-end">
                    {/* Edit Quotation Request button is commented so that it can be deployed if needed to implement in future */}
                    
                    {/* {!isVendorLogin && quotationRequest.status !== QuotationRequestStatus.VOID && (GetPermissions("quotationRequestPermissions", "edit") || (GetPermissions("quotationRequestPermissions", "create") && quotationRequest.createdBy === session?.email)) &&

                        <div className="flex items-center pb-2 md:pb-4">
                            <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => {
                                quotationRequest.status === QuotationRequestStatus.ACTIVE ? setEdit(!edit) : router.push(`${isVendorLogin ? "/vendor" : ""}/quotation_requests/${quotationRequest.quotationRequestId}/edit`);
                            }}>Edit Quotation Request</div>
                        </div>} */}

                    {!isVendorLogin && quotationRequest.status !== QuotationRequestStatus.DRAFT && GetPermissions("quotationRequestPermissions", "create") &&

                        <div className="flex items-center pb-2 md:pb-4">
                            <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => router.push(`/quotation_requests/${quotationRequest.quotationRequestId}/edit?duplicate=${true}`)}>Duplicate Quotation Request</div>
                        </div>}
                </div>

                {isVendorLogin && quotationRequest.status === QuotationRequestStatus.ACTIVE && GetPermissions("quotationPermissions", "create") && <div className="flex flex-col md:flex-row gap-2 justify-end items-end">

                    <div className="flex items-center pb-2 md:pb-4">
                        <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => { router.push(`/vendor/quotation_requests/${quotationRequest.quotationRequestId}/edit`) }}>{quotationRequest.pricing === Pricing.FLAVRFOOD_PRICING ? "Enter Discount & Accept" : "Enter Prices and Accept"}</div>
                    </div>

                </div>}

                <div className="h-full flex flex-col justify-between">

                    <div className="py-4 rounded-lg flex flex-col justify-between md:flex-row">
                        <div className="">
                            <div className="mb-2">
                                <span className="font-bold">Quotation Request Id:</span> {quotationRequest.quotationRequestId}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Quotation Request Name:</span> {quotationRequest.quotationRequestName}
                            </div>
                            {!isVendorLogin && <div className="mb-2">
                                <span className="font-bold">Procurement Name:</span> {quotationRequest.procurement?.procurementName}
                            </div>}
                            {!isVendorLogin && <div className="mb-2 md:flex gap-1">
                                <div className="font-bold">Vendors List:</div>
                                <ul>
                                    {quotationRequest.vendors?.map((vendor: Vendor) => (
                                        <li key={vendor.vendorId}>{vendor.businessName} - <span className="underline text-custom-link-blue cursor-pointer break-all" onClick={() => router.push(`/quotations/vendors_response/${vendor.vendorId}?quotationRequestId=${quotationRequest.quotationRequestId}`)}>{vendorIdQuotationsMap[vendor.vendorId]?.status}</span>{vendorIdQuotationsMap[vendor.vendorId]?.status ? "" : <span className="text-custom-yellow">No Response</span>}</li>
                                    ))}
                                </ul>
                            </div>}
                            <div className="mb-2">
                                <span className="font-bold">Status:</span> <span className={quotationRequestStatusColor(quotationRequest.status)}>{quotationRequest.status === QuotationRequestStatus.ACTIVE ?
                                    isVendorLogin ? "RECEIVED" : "SENT" : quotationRequest.status}</span>
                            </div>
                            {edit ? <div className="mb-4 flex">
                                <label className="font-bold my-auto">Expiry Date
                                    <span className="text-custom-theme">*</span>: </label>
                                <DatePicker
                                    selected={expiryDate}
                                    onChange={(date) => {
                                        setExpiryDate(date as Date);
                                    }}
                                    dateFormat="MMMM d, yyyy"
                                    minDate={new Date()}
                                    className="filter w-full px-2 border border-custom-theme rounded-md cursor-pointer outline-none"
                                />
                            </div> :
                                <div className='mb-2'>
                                    <span className="font-bold">Expiry Date: </span>
                                    <span className="text-custom-red">{convertDateTime(quotationRequest.expiryDate.toString())}</span>
                                </div>}
                        </div>
                        {!isVendorLogin && <div className="">
                            <div className="mb-2">
                                <span className="font-bold">Created By:</span> {quotationRequest.createdBy}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Created At:</span> {convertDateTime(quotationRequest.createdAt!.toString())}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Updated By:</span> {quotationRequest.updatedBy}
                            </div>
                            <div className="mb-2">
                                <span className="font-bold">Updated At:</span> {convertDateTime(quotationRequest.updatedAt!.toString())}
                            </div>
                        </div>}
                    </div>

                    <div>
                        <div className={`flex flex-col md:flex-row justify-between`}>
                            <h2 className="md:text-2xl mb-4">Products</h2>
                            <div className="text-sm md:text-base">Total Products: {quotationRequest.products!.length}</div>
                        </div>
                    </div>
                    <div className="my-2 shadow-[0_0_0_2px_rgba(0,0,0,0.1)] max-h-[450px] overflow-y-auto">
                        {
                            quotationRequest.products && quotationRequest.products.map((product: Product, index: number) => {
                                return <div key={index} className='relative flex flex-col bg-white m-2 border rounded border-custom-gray-3'>
                                    <div className='flex flex-row justify-between items-center w-full'>
                                        <div className="flex flex-col md:flex-row ml-2 md:ml-0 justify-start items-center md:gap-4">
                                            <div className='flex flex-row'>
                                                <img src={product.imgPath} className=' w-14 h-14 border rounded md:w-20 md:h-20 m-1 mt-1 justify-items-start cursor-pointer' />
                                                <div className='flex flex-row justify-between items-center w-full cursor-pointer'>
                                                    <div className='text-sm md:text-base font-semibold'>{product.productName}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className='text-sm md:text-base font-semibold'>Category: <span className="text-custom-blue">{product.category}</span></div>
                                                <div className='text-sm md:text-base font-semibold'>Sub-Category: <span className="text-custom-pink">{product.subCategory}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row m-2">
                                        <div className='border md:w-36 flex justify-center items-center pl-2 rounded-md focus:outline-none w-full' >
                                            {product.packSize}
                                        </div>
                                        {edit ?
                                            <div className='flex gap-2 items-center m-2'>
                                                Quantity: <input
                                                    type="number"
                                                    defaultValue={quotationRequest.quotationRequestProducts[product.sellerProductId]}
                                                    onChange={handleQuantityChange(product.sellerProductId)}
                                                    className={`solid w-16 text-center border-2 border-custom-theme focus:outline-none`}
                                                />
                                            </div> :
                                            <div className='flex flex-row md:justify-end mt-2 md:mt-0 mx-2'>
                                                <span>Quantity: {quotationRequest.quotationRequestProducts[product.sellerProductId]}</span>
                                            </div>}
                                    </div>
                                </div>
                            }
                            )
                        }
                    </div>
                </div>
                {edit && <div className="mt-16"><button
                    className="block bg-custom-theme text-custom-buttonText hover:bg-hover-theme rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0"
                    onClick={updateQuotationRequest}
                >
                    Update Quotation
                </button></div>}
            </> : <AccessDenied />}
    </>
    );
}

export default ViewQuotationRequest






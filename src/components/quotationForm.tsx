'use client'
import { Product, Taxes } from '@/types/product'
import { Quotation, QuotationProducts } from '@/types/quotation'
import React, { useState } from 'react'
import QuotationLineItem from './quotationLineItem'
import axios from 'axios'
import { Note } from '@/types/note'
import { useRouter } from 'next/navigation'
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import DatePickerComponent from './DatePicker';
import { NoteType, QuotationStatus } from '@prisma/client'
import { formatAmount, formattedPrice } from '@/utils/helperFrontendFunctions'
import Loading from '@/app/loading'
interface QuotationComponentProps {
    quotation: Quotation
    setQuotation: React.Dispatch<React.SetStateAction<Quotation>>
    isVendor?: boolean,
    productIdTaxMap?: Map<string, Taxes> | null
    isViewOnly?: boolean
}
const QuotationForm: React.FC<QuotationComponentProps> = ({ quotation, setQuotation, isVendor, productIdTaxMap, isViewOnly }) => {
    const quotationId = quotation.quotationId;
    const router = useRouter()
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setQuotation((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    }
    const handleExpireyDateChange = (e: any) => {
        setQuotation((prevData) => ({
            ...prevData,
            expiryDate: e,
        }));
    }

    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const PopupDialog = ({ isOpen, onClose }: any) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg border-4 shadow-lg">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Reason for Rejection</h2>
                    <textarea
                        className='border-2 border-custom-red solid w-full text-center rounded'
                        placeholder='Enter a reason for rejection'
                        onBlur={(e) => setRejectionReason(e.target.value)}
                        defaultValue={rejectionReason}
                    />
                    <div className='flex justify-between'>
                        <button
                            onClick={closePopup}
                            className="mt-6 px-4 py-2 bg-custom-red text-white rounded-md hover:bg-hover-red"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReject}
                            className="mt-6 px-4 py-2 bg-custom-green text-white rounded-md hover:bg-hover-green"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    const updateQuotation = async (quotation: Quotation) => {
        delete quotation.products;
        delete quotation.vendor;
        try {
            await axios.put('/api/quotations/update', { quotation, quotationId })
        } catch (error) {
            console.log('error  :>> ', error);
            throw new Error("Update quotation failed");
        }
    }

    const handleAccept = async () => {
        let quot: Quotation = quotation;
        quot.status = QuotationStatus.ACCEPTED
        try {
            await updateQuotation(quotation)
            alert("Quotation accepted successfully !")
            router.push('/quotations')
        } catch (error) {
            alert("Please try again later !");
            console.error('Handling error:', error);
        }
    };

    const handleCancleQuot = async () => {
        let quot: Quotation = quotation;
        quot.status = QuotationStatus.VOID
        try {
            await updateQuotation(quotation)
            alert("Quotation Cancled successfully !")
            router.push('/quotations')
        } catch (error) {
            alert("Please try again later !");
            console.error('Handling error:', error);
        }
    };

    const createRejectionNote = async () => {
        const note: Note = {
            entityType: NoteType.QUOTATION,
            entityId: quotationId!,
            message: rejectionReason
        }
        await axios.post("/api/notes/create", { note })
    }
    const handleReject = async () => {
        if (rejectionReason.trim().length <= 0) {
            alert('Please enter a reason for rejection !');
            return;
        }
        let quot: Quotation = quotation;
        quot.status = QuotationStatus.REJECTED
        try {
            await Promise.all([
                updateQuotation(quotation),
                createRejectionNote()
            ])
            alert("Quotation rejected successfully !")
            router.push('/quotations')
        } catch (error) {
            alert("Please try again later !");
            console.error('Handling error:', error);
        }
    };
    let [total, amount, totalTax, totalDiscount] = [0, 0, 0, 0]
    const quotationProductsDetails: { [key: string]: QuotationProducts } = {}
    quotation.products?.forEach((product: Product) => {
        quotationProductsDetails[product.productId!] = { ...quotation.quotationProducts[product.productId] }
    });
    Object.keys(quotationProductsDetails).forEach((key) => {
        const taxes: Taxes | undefined = productIdTaxMap!.get(key!)
        const [igst, cgst, sgst, cess] = taxes ? [taxes!.igst ?? 0, taxes!.cgst ?? 0, taxes!.sgst ?? 0, taxes!.cess ?? 0] : [0, 0, 0, 0]
        const itemTotalTaxRate = (igst ? igst + cess : cgst + sgst + cess);
        amount = formatAmount(amount + (quotationProductsDetails[key].acceptedQty * quotationProductsDetails[key].supplierPrice))
        totalTax = amount * itemTotalTaxRate / 100;
    })
    totalDiscount = amount * (quotation?.discountPercentage) / 100;
    total = formatAmount(total + amount + totalTax - totalDiscount)

    const saveQuotation = async () => {
        setLoading(true);
        const newQuotation = quotation;
        delete newQuotation.products;
        delete newQuotation.vendor;
        delete newQuotation.quotationId;
        delete newQuotation.createdAt;
        delete newQuotation.updatedAt;
        quotation.status = QuotationStatus.PENDING;
        try {
            await Promise.all([axios.post("/api/quotations/create", newQuotation), axios.put("/api/quotations/update", { quotation: { status: QuotationStatus.VOID }, quotationId })]);
            alert("Quotation updated successfully")
        } catch (error) {
            console.log('error :>> ', error);
        }
        setLoading(false);
        window.open("/quotations", "_self");
    }

    const handleDiscount = (e: any) => {
        const { id, value } = e.target;
        setQuotation((prevData) => ({
            ...prevData,
            [id]: Number(value),
        }));
        const errorMessage = document.getElementById('errorMessage');
        if (Number(e.target.value) < 0 || Number(e.target.value) > 100)
            errorMessage!.style.display = 'inline';
        else
            errorMessage!.style.display = 'none';
    }


    return (
        <>
            {loading ? <Loading /> : <>
                <PopupDialog isOpen={isPopupOpen} onClose={closePopup} />
                {isVendor ? <>
                    <div className="mb-4">
                        <label className="block font-bold text-sm mb-2" htmlFor="planName">
                            Quotation Name
                        </label>
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                            type="text"
                            id="quotationName"
                            placeholder="Enter Name"
                            defaultValue={quotation.quotationName}
                            onChange={handleChange}
                            required
                            readOnly={true}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold text-sm mb-2" htmlFor="planName">
                            Expiry Date<span className="text-custom-red text-xs">*</span>
                        </label>
                        <DatePickerComponent
                            value={new Date(quotation.expiryDate ?? new Date())}
                            onChange={handleExpireyDateChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold text-sm mb-2">
                            Discount (%)<span className="text-custom-red text-xs">*</span>
                        </label>
                        <input
                            className="w-24 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                            type="number"
                            id="discountPercentage"
                            onChange={handleDiscount}
                            defaultValue={0}
                            required
                        />
                        <span id="errorMessage" className="ml-2 hidden text-custom-red">Enter a valid % between 0 & 100</span>
                    </div>
                </> :
                    <div className="flex justify-between items-center mb-6">
                        <div>

                            <div className='flex gap-2'>
                                <p className="font-bold text-custom-gray-4">Quotation Name: </p><span className="text-custom-gray-4">{quotation.quotationName}</span>
                            </div>
                            <div className='flex gap-2'>
                                <p className="font-bold text-custom-gray-4">Quotation Id: </p><span className="text-custom-gray-4">{quotation.quotationId}</span>
                            </div>
                            <div className='flex gap-2'>
                                <p className="font-bold text-custom-gray-4">Vendor Name:  </p><span className="text-custom-gray-4">{quotation.vendor?.businessName}</span>
                            </div>
                            <div className='flex gap-2'>
                                <p className="font-bold text-custom-gray-4">Status:  </p><span className="text-custom-gray-4">{quotation.status}</span>
                            </div>
                            {edit ?
                                <div className="mb-4 flex">
                                    <label className="font-bold text-custom-gray-4 my-auto">Expiry Date
                                        <span className="text-custom-red">*</span>: </label>
                                    <DatePicker
                                        selected={new Date(quotation.expiryDate ?? new Date())}
                                        onChange={handleExpireyDateChange}
                                        dateFormat="MMMM d, yyyy"
                                        minDate={new Date()}
                                        className="filter w-full px-2 border border-custom-red rounded-md cursor-pointer outline-none"
                                    />
                                </div> :
                                <div className='flex gap-2'>
                                    <p className="font-bold text-custom-gray-4">Expiry Date:  </p><span className="text-custom-gray-4">
                                        {quotation.expiryDate?.toDateString()}</span>
                                </div>}

                            {edit ?
                                <div className="mb-4 flex">
                                    <label className="font-bold text-custom-gray-4 my-auto">Discount (%)
                                        <span className="text-custom-red">*</span>: </label>
                                    <input
                                        className="w-16 border border-custom-red px-2 rounded outline-none"
                                        type="number"
                                        id="discountPercentage"
                                        onChange={handleDiscount}
                                        defaultValue={quotation.discountPercentage}
                                        required
                                    />
                                     <span id="errorMessage" className="ml-2 hidden text-custom-red">Enter a valid % between 0 & 100</span>
                                </div> :
                                <div className='flex gap-2'>
                                    <p className="font-bold text-custom-gray-4">Discount (%): </p><span className="text-custom-gray-4">
                                         {quotation.discountPercentage}</span>
                                </div>}
                        </div>

                        {!isVendor && <div className="flex flex-col mb-6">

                            {!isVendor && !isViewOnly && <div className="flex space-x-4 mb-2">
                                <button className="bg-custom-green hover:bg-hover-green text-white px-4 py-2 rounded-md" onClick={handleAccept} >Accept</button>
                                <button className="bg-custom-red hover:bg-hover-red text-white px-4 py-2 rounded-md" onClick={openPopup}>Reject</button>
                            </div>}

                            <div className="flex space-x-4">
                                {!isVendor && <div className="flex space-x-4">
                                    <button className="bg-custom-red hover:bg-hover-red text-white px-4 py-2 rounded-md" onClick={() => setEdit(!edit)}>Edit Quotation</button>
                                </div>}

                                {!isVendor && quotation.status === QuotationStatus.ACCEPTED && <div className="flex space-x-4">
                                    <button className="bg-custom-red hover:bg-hover-red text-white px-4 py-2 rounded-md" onClick={handleCancleQuot}>Void Quotation</button>
                                </div>}
                            </div>

                            <div className='flex gap-2'>
                                <p className="font-bold text-custom-gray-4">Created By: </p><span className="text-custom-gray-4">{quotation.createdBy}</span>
                            </div>

                            <div className='flex gap-2'>
                                <p className="font-bold text-custom-gray-4">Created At: </p><span className="text-custom-gray-4">{quotation.createdAt?.toDateString()}</span>
                            </div>

                        </div>}

                    </div>}

                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Items Requested</h3>
                    <div className="overflow-x-auto border-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pack Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Qty.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accepted Qty.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (without GST)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (with GST)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (with Discount)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Rate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount (without GST & Discount)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {quotation.products?.map((product: Product, index: number) => (
                                    <QuotationLineItem key={index} product={product} quotation={quotation} setQuotation={setQuotation} isVendor={isVendor} productIdTaxMap={productIdTaxMap} edit={edit} />
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end">
                        </div>
                    </div>
                    <div className="float-right p-8">
                        <div className='flex gap-2'>
                            <p className="font-bold text-custom-gray-4">Subtotal:</p><span className="text-custom-gray-4">{formattedPrice(formatAmount(amount))}</span>
                        </div>
                        <div className='flex gap-2'>
                            <p className="font-bold text-custom-gray-4">+ Total Tax : </p><span className="text-custom-gray-4"> {formattedPrice(formatAmount(totalTax))}</span>
                        </div>
                        <div className='flex gap-2'>
                            <p className="font-bold text-custom-gray-4">- Total Discount : </p><span className="text-custom-gray-4">{formattedPrice(formatAmount(amount * quotation?.discountPercentage) / 100)}</span>
                        </div>
                        <hr className="border-custom-red border" />
                        <div className='flex gap-2'>
                            <p className="font-bold text-xl text-custom-gray-4">Total Amount : </p><span className="text-custom-gray-4 text-xl ">{formattedPrice(formatAmount(total))}</span>
                        </div>
                    </div>

                </div>
                {edit && <button
                    className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0"
                    onClick={saveQuotation}
                    type="submit"
                >
                    Send Quotation
                </button>}
            </>}
        </>
    )
}

export default QuotationForm
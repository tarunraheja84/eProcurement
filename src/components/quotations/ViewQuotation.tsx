"use client"
import React, { useEffect, useState } from 'react';
import { Product, Taxes } from '@/types/product';
import { calculateGST, convertDateTime, formatAmount, formattedPrice, getPermissions, getTaxRates } from '@/utils/helperFrontendFunctions';
import { NoteType, Pricing, QuotationStatus } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { UserType } from '@/types/enums';
import { useRouter } from 'next/navigation';
import ShoppingCartIcon from '@/svg/ShoppingCartIcon';
import Loading from '@/app/loading';
import axios from 'axios';
import { Note } from '@/types/note';
import AccessDenied from '@/app/access_denied/page';

type Props={
    quotation:any,
    quotationRequestSender:string
    rejectionNote:string,
}
const ViewQuotation = ({ quotation, quotationRequestSender, rejectionNote }: Props) => {
    const [productIdTaxMap, setProductIdTaxMap] = useState<Map<string, Taxes> | null>(null);
    const [loading, setLoading]= useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [openPopup, setOpenPopup] = useState(false);
    const productIds = quotation?.products.map((product: Product) => product.productId)!;
    const session: UserSession | undefined = useSession().data?.user;
    const isVendorLogin = session?.userType === UserType.VENDOR_USER ? true : false
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const prodIdTaxMap = await getTaxRates(productIds);
            setProductIdTaxMap(prodIdTaxMap);
        })();
    }, [])

    const voidQuotation= async ()=>{
        const flag = confirm("Are you sure?");
        if (!flag) return;
        setLoading(true);
        try {
            await axios.put('/api/quotations/update', {quotation:{status: QuotationStatus.VOID}, quotationId:quotation.quotationId})
            alert("Quotation updated successfully")
            window.open("/vendor/quotations/all_quotations", "_self")
        } catch (error) {
            console.log('error :>> ', error);
        }
        setLoading(false);
    }

    const acceptQuotation = async () => {
        const flag = confirm("Are you sure?");
        if (!flag) return;
        setLoading(true);
        try {
            await axios.put('/api/quotations/update', {quotation:{status: QuotationStatus.ACCEPTED}, quotationId:quotation.quotationId})
            alert("Quotation accepted successfully !")
            router.push('/quotations')
        } catch (error) {
            alert("Please try again later !");
            console.log('error :>> ', error);
        }
        setLoading(false);
    };

    const rejectQuotation = async () => {
        if (rejectionReason.trim().length <= 0) {
            alert('Please enter a reason for rejection !');
            return;
        }
        const flag = confirm("Are you sure?");
        if (!flag) return;
        setLoading(true);
        try {
            await Promise.all([
                await axios.put('/api/quotations/update', {quotation:{status: QuotationStatus.REJECTED}, quotationId:quotation.quotationId}),
                createRejectionNote()
            ])
            alert("Quotation rejected successfully !")
            router.push('/quotations')
        } catch (error) {
            alert("Please try again later !");
            console.log('error :>> ', error);
        }
        setLoading(false);
    };

    const createRejectionNote = async () => {
        const note: Note = {
            entityType: NoteType.QUOTATION,
            entityId: quotation.quotationId,
            message: rejectionReason
        }
        await axios.post("/api/notes/create", { note })
    }

    const PopupDialog = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg border-4 shadow-lg">
                <div className="bg-white rounded-lg shadow-lg p-6 w-10/12 max-w-md text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Reason for Rejection</h2>
                    <textarea
                        className='border-2 border-custom-theme solid w-full text-center rounded'
                        placeholder='Enter a reason for rejection'
                        onBlur={(e) => setRejectionReason(e.target.value)}
                        defaultValue={rejectionReason}
                    />
                    <div className='flex justify-between'>
                        <button
                            onClick={()=>{setOpenPopup(false)}}
                            className="mt-6 px-4 py-2 bg-custom-theme text-white rounded-md hover:bg-hover-theme"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={rejectQuotation}
                            className="mt-6 px-4 py-2 bg-custom-green text-white rounded-md hover:bg-hover-green"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {getPermissions("quotationPermissions","view") ? loading ? <Loading /> :
        <>
            {openPopup && <PopupDialog />}
            <h1 className="text-2xl font-bold text-custom-theme mb-4">Quotation Details</h1>
            <hr className="border-custom-theme border mb-4" />

            {<div className="flex flex-col md:flex-row gap-2 justify-end items-end">

                {isVendorLogin && (getPermissions("quotationPermissions","edit") || (getPermissions("quotationPermissions","create") && quotation.createdBy===session?.email)) && <div className="flex items-center pb-2 md:pb-4">
                    <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-white rounded-md outline-none cursor-pointer" onClick={() => {
                        router.push(`${isVendorLogin ? "/vendor" : ""}/quotations/${quotation.quotationId}/edit`);
                    }}>Edit Quotation</div>
                </div>}

                {isVendorLogin && (getPermissions("quotationPermissions","edit") || (getPermissions("quotationPermissions","create") && quotation.createdBy===session?.email)) && <div className="flex items-center pb-2 md:pb-4">
                    <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-white rounded-md outline-none cursor-pointer" onClick={voidQuotation}>Void Quotation</div>
                </div>}

                {quotation.status === QuotationStatus.ACCEPTED && !isVendorLogin && getPermissions("orderPermissions","create") && <div className="p-2 text-center align-middle">
                    <button className="flex gap-2 bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-white rounded-md outline-none cursor-pointer" onClick={() => router.push(`/orders/create/${quotation.quotationId}`)}>
                        <ShoppingCartIcon />
                        <div>Purchase Order</div></button>
                </div>}

                {quotation.status === QuotationStatus.PENDING && !isVendorLogin && (getPermissions("quotationPermissions","edit") || quotationRequestSender===session?.email) && <div className="p-2 text-center align-middle">
                    <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-white rounded-md outline-none cursor-pointer" onClick={acceptQuotation}>Accept Quotation</div>
                </div>}

                {quotation.status === QuotationStatus.PENDING && !isVendorLogin && (getPermissions("quotationPermissions","edit") || quotationRequestSender===session?.email) && <div className="p-2 text-center align-middle">
                    <div className="bg-custom-red hover:bg-hover-red px-3 py-2 md:px-5 md:py-3 text-white rounded-md outline-none cursor-pointer" onClick={() => {setOpenPopup(true)}}>Reject Quotation</div>
                </div>}

            </div>}

            {quotation.status===QuotationStatus.REJECTED && <div className="text-center"><span className="font-bold">Rejection Reason:</span> {rejectionNote}</div>}

            <div className="h-full flex flex-col justify-between">

                <div className="py-4 rounded-lg flex flex-col justify-between md:flex-row">
                    <div className="">
                        <div className="mb-2">
                            <span className="font-bold">Quotation Id:</span> {quotation.quotationId}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Quotation Name:</span> {quotation.quotationName}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Status:</span> {quotation.status}
                        </div>
                        <div className='mb-2'>
                            <span className="font-bold">Expiry Date: </span>
                            {convertDateTime(quotation.expiryDate.toString())}
                        </div>
                    </div>
                    {isVendorLogin && <div className="">
                        <div className="mb-2">
                            <span className="font-bold">Accepted By:</span> {quotation.createdBy}
                        </div>
                        <div className="mb-2">
                            <span className="font-bold">Accepted At:</span> {convertDateTime(quotation.createdAt.toString())}
                        </div>
                    </div>}
                </div>

                <div>
                    <div className={`flex flex-col md:flex-row justify-between`}>
                        <h2 className="md:text-2xl mb-4">Products</h2>
                        <div className="text-sm md:text-base">Total Products: {quotation.products!.length}</div>
                    </div>
                </div>
                <div className="my-2 shadow-[0_0_0_2px_rgba(0,0,0,0.1)] max-h-[450px] overflow-y-auto">
                    {
                        quotation.products && quotation.products.map((product: Product, index: number) => {
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
                                    <div className="md:absolute m-2 top-0 right-0 cursor-pointer">
                                        <div className="">Unit Price: ₹{quotation.quotationProducts[product.sellerProductId].supplierPrice}</div>
                                        {quotation.pricing === Pricing.FLAVRFOOD_PRICING && <div className="">Discount: {quotation.quotationProducts[product.sellerProductId].discountPercentage}%</div>}
                                        <div className="">GST: {calculateGST(productIdTaxMap!, product.productId)}%</div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row m-2">
                                    <div className='border md:w-36 flex justify-center items-center pl-2 rounded-md focus:outline-none w-full' >
                                        {product.packSize}
                                    </div>
                                    <div className='flex flex-row md:justify-end mt-2 md:mt-0 mx-2'>
                                        <span>Quantity: {quotation.quotationProducts[product.sellerProductId].acceptedQty}</span>
                                    </div>
                                </div>
                            </div>
                        }
                        )
                    }
                </div>
                <div className="p-8 w-fit self-end">
                    <div className='flex gap-2'>
                        <p className="font-bold text-custom-gray-4">Subtotal:</p><span className="text-custom-gray-4">{formattedPrice(formatAmount(quotation.amount))}</span>
                    </div>
                    <div className='flex gap-2'>
                        <p className="font-bold text-custom-gray-4">+ Total Tax : </p><span className="text-custom-gray-4"> {formattedPrice(formatAmount(quotation.totalTax))}</span>
                    </div>
                    <hr className="border-custom-theme border" />
                    <div className='flex gap-2'>
                        <p className="font-bold text-xl text-custom-gray-4">Total Amount : </p><span className="text-custom-gray-4 text-xl ">{formattedPrice(formatAmount(quotation.total))}</span>
                    </div>
                </div>
            </div>
        </>: <AccessDenied />}
        </>
    );
}

export default ViewQuotation






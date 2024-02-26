"use client"
import React, { useState } from 'react';
import { convertDateTime, formatAmount, formattedPrice, getPermissions } from '@/utils/helperFrontendFunctions';
import { NoteType, QuotationStatus } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { ProductStatus, UserType } from '@/types/enums';
import { useRouter } from 'next/navigation';
import ShoppingCartIcon from '@/svg/ShoppingCartIcon';
import Loading from '@/app/loading';
import axios from 'axios';
import { Note } from '@/types/note';
import AccessDenied from '@/app/access_denied/page';
import QuotationProducts from './QuotationProducts';
import { Product } from '@/types/product';

type Props = {
    quotation: any,
    quotationRequestSender?: string
    rejectionNote?: string,
}
const ViewQuotation = ({ quotation, quotationRequestSender, rejectionNote }: Props) => {
    const [loading, setLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [openPopup, setOpenPopup] = useState(false);
    const session: UserSession | undefined = useSession().data?.user;
    const isVendorLogin = session?.userType === UserType.VENDOR_USER ? true : false
    const router = useRouter();

    const voidQuotation = async () => {
        const flag = confirm("Are you sure?");
        if (!flag) return;
        setLoading(true);
        try {
            await axios.put('/api/quotations/update', { quotation: { status: QuotationStatus.VOID }, quotationId: quotation.quotationId })
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
            await axios.put('/api/quotations/update', { quotation: { status: QuotationStatus.ACCEPTED }, quotationId: quotation.quotationId })
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
                await axios.put('/api/quotations/update', { quotation: { status: QuotationStatus.REJECTED }, quotationId: quotation.quotationId }),
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
                    <h2 className="text-2xl font-semibold text-custom-gray-5">Reason for Rejection</h2>
                    <textarea
                        className='border-2 border-custom-theme solid w-full text-center rounded'
                        placeholder='Enter a reason for rejection'
                        onBlur={(e) => setRejectionReason(e.target.value)}
                        defaultValue={rejectionReason}
                    />
                    <div className='flex justify-between'>
                        <button
                            onClick={() => { setOpenPopup(false) }}
                            className="mt-6 px-4 py-2 bg-custom-theme text-custom-buttonText rounded-md hover:bg-hover-theme"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={rejectQuotation}
                            className="mt-6 px-4 py-2 bg-custom-green text-custom-buttonText rounded-md hover:bg-hover-green"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const newProducts=quotation?.products.filter((product:Product)=>quotation?.quotationProducts[product.sellerProductId].productStatus===ProductStatus.NEW);
    const editedOldProducts=quotation?.products.filter((product:Product)=>quotation?.quotationProducts[product.sellerProductId].productStatus===ProductStatus.OLD_UPDATED);
    const uneditedOldProducts=quotation?.products.filter((product:Product)=>quotation?.quotationProducts[product.sellerProductId].productStatus===ProductStatus.OLD_UNCHANGED);

    return (
        <>
            {getPermissions("quotationPermissions", "view") ? 
                <>
                    {loading && <div className="absolute inset-0 z-10"><Loading /></div>}
                    {openPopup && <PopupDialog />}
                    <h1 className="text-2xl font-bold text-custom-theme mb-4">Quotation Details</h1>
                    <hr className="border-custom-theme border mb-4" />

                    {<div className="flex flex-col md:flex-row gap-2 justify-end items-end">

                        {(quotation.status === QuotationStatus.ACCEPTED || quotation.status === QuotationStatus.PENDING) && isVendorLogin && (getPermissions("quotationPermissions", "edit") || (getPermissions("quotationPermissions", "create") && quotation.createdBy === session?.email)) && <div className="flex items-center pb-2 md:pb-4">
                            <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => {
                                router.push(`${isVendorLogin ? "/vendor" : ""}/quotations/${quotation.quotationId}/edit`);
                            }}>Edit Quotation</div>
                        </div>}

                        {isVendorLogin && quotation.status !== QuotationStatus.VOID && (getPermissions("quotationPermissions", "edit") || (getPermissions("quotationPermissions", "create") && quotation.createdBy === session?.email)) && <div className="flex items-center pb-2 md:pb-4">
                            <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={voidQuotation}>Void Quotation</div>
                        </div>}

                        {quotation.status === QuotationStatus.ACCEPTED && !isVendorLogin && getPermissions("orderPermissions", "create") && <div className="p-2 text-center align-middle">
                            <button className="flex gap-2 bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => router.push(`/orders/create/${quotation.quotationId}`)}>
                                <ShoppingCartIcon />
                                <div>Purchase Order</div></button>
                        </div>}

                        {quotation.status === QuotationStatus.PENDING && !isVendorLogin && (getPermissions("quotationPermissions", "edit") || quotationRequestSender === session?.email) && <div className="p-2 text-center align-middle">
                            <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={acceptQuotation}>Accept Quotation</div>
                        </div>}

                        {quotation.status === QuotationStatus.PENDING && !isVendorLogin && (getPermissions("quotationPermissions", "edit") || quotationRequestSender === session?.email) && <div className="p-2 text-center align-middle">
                            <div className="bg-custom-red hover:bg-hover-red px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => { setOpenPopup(true) }}>Reject Quotation</div>
                        </div>}

                    </div>}

                    {quotation.status === QuotationStatus.REJECTED && <div className="text-center"><span className="font-bold">Rejection Reason:</span> {rejectionNote}</div>}

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
                                    <span className="text-custom-red">{convertDateTime(quotation.expiryDate.toString())}</span>
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

                        <div className="flex flex-col gap-16">
                            <QuotationProducts quotation={quotation} products={newProducts} productsHeading={"New Products"} />
                            <QuotationProducts quotation={quotation} products={editedOldProducts} productsHeading={"Updated Old Products"} />
                            <QuotationProducts quotation={quotation} products={uneditedOldProducts} productsHeading={"Unchanged Old Products"} />
                        </div>

                        <div className="mt-8 w-fit self-end">
                            <div className='flex gap-2'>
                                <p className="font-bold text-custom-gray-4">Subtotal:</p><span className="text-custom-gray-4">{formattedPrice(formatAmount(quotation.amount))}</span>
                            </div>
                            <div className='flex gap-2'>
                                <p className="font-bold text-custom-gray-4">+ Total Tax : </p><span className="text-custom-gray-4"> {formattedPrice(formatAmount(quotation.totalTax))}</span>
                            </div>
                            <hr className="border-custom-theme border" />
                            <div className='flex gap-2'>
                                <p className="font-bold text-xl text-custom-gray-4">Total Amount :</p><span className="text-custom-gray-4 text-xl ">{formattedPrice(formatAmount(quotation.total))}</span>
                            </div>
                        </div>
                    </div>
                </> : <AccessDenied />}
        </>
    );
}

export default ViewQuotation






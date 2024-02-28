'use client'
import React, { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import axios from "axios";
import { Product } from "@/types/product";
import Loading from "@/app/loading";
import { Pricing, Procurement, QuotationRequestStatus } from "@prisma/client";
import AccessDenied from "@/app/access_denied/page";
import { usePermissions } from "@/utils/helperFrontendFunctions";

type VendorIdToBusinessNameMap = { vendorId: string, businessName: string }

type FormData = {
    quotationRequestName: string,
    procurementId: string,
    status: QuotationRequestStatus,
    pricing: Pricing,
    expiryDate: Date
}

type Props = {
    quotationRequest?: any;
    vendorIdToBusinessNameMap: VendorIdToBusinessNameMap[];
    procurementId?: string;
    context:any
}

export default function QuotationRequestForm({ quotationRequest, vendorIdToBusinessNameMap, procurementId, context }: Props) {
    const today=new Date();
    const [selectVendor, setSelectVendor] = useState<VendorIdToBusinessNameMap[] | null>(null);
    const [searchMode, setSearchMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        quotationRequestName: quotationRequest ? quotationRequest.quotationRequestName : '',
        procurementId: quotationRequest ? quotationRequest.procurementId! : procurementId!,
        status: quotationRequest ? quotationRequest.status : QuotationRequestStatus.DRAFT,
        pricing: Pricing.MANUAL_PRICING,
        expiryDate: quotationRequest ? quotationRequest.expiryDate : new Date(today.setDate(today.getDate() + 7)),
    });
    const [procurement, setProcurement] = useState<any>(null)
    const [productQuantityMap, setProductQuantityMap] = useState(new Map());
    const [duplicateQuotationRequest, setDuplicateQuotationRequest] = useState(false);

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleExpiryDateChange = (e: any) => {
        setFormData((prevData:FormData) => ({
            ...prevData,
            expiryDate: e,
        }));
    }

    const createQuotationRequest = async (e: FormEvent) => {
        e.preventDefault();
        const flag = confirm("Are you sure?");
        if (!flag) return;
        const vendorIds = selectVendor?.map((vendor: VendorIdToBusinessNameMap) => vendor.vendorId);
        if (!formData.quotationRequestName) { alert("Please Enter Quotation Request Name"); return };
        if (!vendorIds || vendorIds.length === 0) { alert("Please select atleast one vendor"); return };

        setLoading(true);

        try {
            let quotationRequestProducts: { [key: string]: number } = {};
            productQuantityMap.forEach((value, key) => {
                if(value)
                    quotationRequestProducts[key] = value;
            });

            const quotation_request = {
                quotationRequestName: formData.quotationRequestName,
                procurementId: formData.procurementId,
                expiryDate: formData.expiryDate,
                pricing: formData.pricing,
                status: formData.status,
                quotationRequestProducts: quotationRequestProducts,
                productIds: procurement?.productIds
            }
            await axios.post("/api/quotation_requests/create", { quotationReq: quotation_request, vendorsIdList: vendorIds })
            alert('Quotation Request Created Successfully.');

            if (formData.status === QuotationRequestStatus.DRAFT)
                window.open("/quotation_requests/my_quotation_requests", "_self")
            else
                window.open("/quotation_requests/all_quotation_requests", "_self")

        } catch (error: any) {
            alert(error.message);
        }
        setLoading(false);
    };

    const updateQuotationRequest = async (e: FormEvent) => {
        e.preventDefault();
        const flag = confirm("Are you sure?");
        if (!flag) return;
        const vendorIds = selectVendor?.map((vendor: VendorIdToBusinessNameMap) => vendor.vendorId);
        if (!formData.quotationRequestName) { alert("Please Enter Quotation Request Name"); return };
        if (!vendorIds || vendorIds.length === 0) { alert("Please select atleast one vendor"); return };

        setLoading(true);

        try {
            let quotationRequestProducts: { [key: string]: number } = {};
            productQuantityMap.forEach((value, key) => {
                if(value)
                    quotationRequestProducts[key] = value;
            });

            const quotation_request = {
                quotationRequestName: formData.quotationRequestName,
                procurementId: formData.procurementId,
                expiryDate: formData.expiryDate,
                pricing: formData.pricing,
                status: formData.status,
                quotationRequestProducts: quotationRequestProducts,
                productIds: procurement?.productIds
            }
            await axios.put("/api/quotation_requests/update", { quotationReq: quotation_request, quotationRequestId: quotationRequest?.quotationRequestId! })
            alert('Quotation Request Updated Successfully.');

            if (formData.status === QuotationRequestStatus.DRAFT)
                window.open("/quotation_requests/my_quotation_requests", "_self")
            else
                window.open("/quotation_requests/all_quotation_requests", "_self")

        } catch (error: any) {
            alert(error.message);
        }
        setLoading(false);
    };

    const handleDuplicateQuotationRequest = async (e: FormEvent) => {
        e.preventDefault();
        const flag = confirm("Are you sure?");
        if (!flag) return;
        const vendorIds = selectVendor?.map((vendor: VendorIdToBusinessNameMap) => vendor.vendorId);
        if (!formData.quotationRequestName) { alert("Please Enter Quotation Request Name"); return };
        if (formData.quotationRequestName === quotationRequest.quotationRequestName) { alert("This Quotation Request should be given a different name from previous one!"); return };
        if (!vendorIds || vendorIds.length === 0) { alert("Please select atleast one vendor"); return };

        setLoading(true);

        try {
            let quotationRequestProducts: { [key: string]: number } = {};
            productQuantityMap.forEach((value, key) => {
                if(value)
                    quotationRequestProducts[key] = value;
            });

            const quotation_request = {
                quotationRequestName: formData.quotationRequestName,
                procurementId: formData.procurementId,
                expiryDate: formData.expiryDate,
                pricing: formData.pricing,
                status: formData.status,
                quotationRequestProducts: quotationRequestProducts,
                productIds: procurement?.productIds
            }
            await axios.post("/api/quotation_requests/create", { quotationReq: quotation_request, vendorsIdList: vendorIds })
            alert('Quotation Request Created Successfully.');

            if (formData.status === QuotationRequestStatus.DRAFT)
                window.open("/quotation_requests/my_quotation_requests", "_self")
            else
                window.open("/quotation_requests/all_quotation_requests", "_self")

        } catch (error: any) {
            alert(error.message);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const newProcurementId = procurementId ? procurementId : formData.procurementId;

            const result = await axios.get(`/api/procurements?procurementId=${newProcurementId}`);
            const procurement: Procurement = result.data
            const newProductQuantityMap = new Map();
            Object.entries(quotationRequest ? quotationRequest.quotationRequestProducts! : procurement.productsQuantity!).forEach(([key, value]) => {
                newProductQuantityMap.set(key, value);
            });
            setSearchMode(false);
            setProcurement(procurement)
            setProductQuantityMap(newProductQuantityMap);
        } catch (error) {
            alert("Search failed. Please try again.");
        }
        setLoading(false);
    }

    useEffect(() => {
        if (procurementId || formData.procurementId)
            handleSearch();

        if(quotationRequest){
            if (context && context.searchParams && context.searchParams.duplicate) {
                setDuplicateQuotationRequest(true);
              }
              else {
                setDuplicateQuotationRequest(false);
              }
        }
        
    }, [])

    const handleQuantityChange = (sellerProductId: string): ChangeEventHandler<HTMLInputElement> => (e) => {
        const { value } = e.target;
        const updatedProductQuantityMap = new Map(productQuantityMap);
        updatedProductQuantityMap.set(sellerProductId, Number(value));
        setProductQuantityMap(updatedProductQuantityMap);
    };

    return (
        <>
            {usePermissions("quotationRequestPermissions", "create") ?
                <>
                    {loading && <div className="absolute inset-0 z-10"><Loading /></div>}
                    <div>
                        <div className="card justify-content-center">
                            <h1 className="text-2xl font-bold text-custom-theme mb-4">{quotationRequest ? duplicateQuotationRequest ? "Duplicate Quotation Request" : "Update Quotation Request": "Create Quotation Request"}</h1>
                            <hr className="border-custom-theme border mb-4" />

                            <div>
                                {!searchMode && <div className="flex justify-end gap-2 mb-4 md:mb-0">
                                    <div className="text-custom-theme font-bold text-xl">Select Pricing: </div>
                                    <select className='focus:outline-none border border-custom-theme rounded cursor-pointer'
                                        id="pricing"
                                        onChange={handleChange}>
                                        <option value={Pricing.MANUAL_PRICING}>Fixed Price</option>
                                        <option value={Pricing.FLAVRFOOD_PRICING}>Variable Price</option>
                                    </select>
                                </div>}

                                <div className="mb-4">
                                    <label className="block font-bold text-sm mb-2">
                                        Procurement Id<span className="text-custom-theme text-xs">*</span>
                                    </label>
                                    <input
                                        className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-theme rounded py-2 px-3 mx-auto outline-none"
                                        type="text"
                                        id="procurementId"
                                        placeholder="Enter Procurement Id"
                                        defaultValue={procurementId ? procurementId : formData.procurementId}
                                        onChange={handleChange}
                                        required
                                        disabled={procurement}
                                    />
                                </div>
                                {searchMode && <div className="block bg-custom-theme text-custom-buttonText hover:bg-hover-theme rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0 cursor-pointer text-center" onClick={handleSearch} >Search</div>}
                            </div>

                            {!searchMode && <form className="flex flex-col gap-[2rem]" onSubmit={quotationRequest ? duplicateQuotationRequest ? handleDuplicateQuotationRequest : updateQuotationRequest : createQuotationRequest}>
                                <div>
                                    <div className="mb-4">
                                        <label className="block font-bold text-sm mb-2">
                                            Quotation Request Name<span className="text-custom-theme text-xs">*</span>
                                        </label>
                                        <input
                                            className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-theme rounded py-2 px-3 mx-auto outline-none"
                                            type="text"
                                            id="quotationRequestName"
                                            placeholder="Enter Name"
                                            onChange={handleChange}
                                            required
                                            defaultValue={formData.quotationRequestName}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block font-bold text-sm mb-2" htmlFor="planName">
                                            Select Vendors<span className="text-custom-theme text-xs">*</span>
                                        </label>
                                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-theme rounded py-2 px-3 outline-none multiselect"
                                        >
                                            <MultiSelect value={selectVendor} onChange={(e: MultiSelectChangeEvent) => setSelectVendor(e.value)} options={vendorIdToBusinessNameMap} optionLabel="businessName"
                                                placeholder="Select Vendor" maxSelectedLabels={2} className="w-full md:w-20rem" required />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block font-bold text-sm mb-2" htmlFor="planName">
                                            Expiry Date<span className="text-custom-theme text-xs">*</span>
                                        </label>
                                        <DatePicker
                                            selected={formData.expiryDate}
                                            onChange={handleExpiryDateChange}
                                            dateFormat="MMMM d, yyyy"
                                            minDate={new Date()}
                                            className="filter w-full px-2 border border-custom-theme rounded-md cursor-pointer outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className={`flex flex-col md:flex-row justify-between`}>
                                        <h2 className="md:text-2xl mb-4">Products</h2>
                                        <div className="text-sm md:text-base">Total Products: {procurement.products!.length}</div>
                                    </div>
                                </div>

                                {!duplicateQuotationRequest && <div className="shadow-[0_0_0_2px_rgba(0,0,0,0.1)] max-h-[450px] overflow-y-auto">
                                    {
                                        procurement?.products.map((product: Product, index: number) => {
                                            return <div key={index} className={`relative flex flex-col m-2 border rounded border-custom-gray-3 ${productQuantityMap.get(product.sellerProductId) > 0 ? "bg-white" : "bg-custom-gray-3"}`}>
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
                                                    {formData.pricing==Pricing.FLAVRFOOD_PRICING && <div className="md:absolute m-2 top-0 right-0 cursor-pointer">
                                                        ₹{product.sellingPrice}
                                                    </div>}
                                                </div>
                                                <div className="flex flex-col md:flex-row m-2">
                                                    <div className='border md:w-36 flex justify-center items-center pl-2 rounded-md focus:outline-none w-full' >
                                                        {product.packSize}
                                                    </div>
                                                    <div className='flex gap-2 items-center m-2'>
                                                        Quantity: <input
                                                            type="number"
                                                            defaultValue={productQuantityMap.get(product.sellerProductId)}
                                                            onChange={handleQuantityChange(product.sellerProductId)}
                                                            className={`solid w-16 text-center border-2 border-custom-theme focus:outline-none`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        )
                                    }
                                </div>}

                                {duplicateQuotationRequest && <div className="shadow-[0_0_0_2px_rgba(0,0,0,0.1)] max-h-[450px] overflow-y-auto">
                                    {
                                        quotationRequest?.products.map((product: Product, index: number) => {
                                            return <div key={index} className={`relative flex flex-col m-2 border rounded border-custom-gray-3 ${productQuantityMap.get(product.sellerProductId) > 0 ? "bg-white" : "bg-custom-gray-3"}`}>
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
                                                    {formData.pricing==Pricing.FLAVRFOOD_PRICING && <div className="md:absolute m-2 top-0 right-0 cursor-pointer">
                                                        ₹{product.sellingPrice}
                                                    </div>}
                                                </div>
                                                <div className="flex flex-col md:flex-row m-2">
                                                    <div className='border md:w-36 flex justify-center items-center pl-2 rounded-md focus:outline-none w-full' >
                                                        {product.packSize}
                                                    </div>
                                                    <div className='flex gap-2 items-center m-2'>
                                                        Quantity: <input
                                                            type="number"
                                                            defaultValue={productQuantityMap.get(product.sellerProductId)}
                                                            onChange={handleQuantityChange(product.sellerProductId)}
                                                            className={`solid w-16 text-center border-2 border-custom-theme focus:outline-none`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        )
                                    }
                                </div>}

                                <div className="md:flex">
                                    <button
                                        className="cursor-pointer block bg-custom-theme text-custom-buttonText hover:bg-hover-theme rounded py-2 px-4 md:w-1/3 mx-auto"
                                        onClick={() => {
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                status: QuotationRequestStatus.DRAFT
                                            }))
                                        }}
                                        type="submit"
                                    >
                                        Save as Draft
                                    </button>
                                    <button
                                        className="block bg-custom-theme text-custom-buttonText hover:bg-hover-theme rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0 cursor-pointer"
                                        onClick={() => {
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                status: QuotationRequestStatus.ACTIVE
                                            }))
                                        }}
                                        type="submit"
                                    >
                                        Send Quotation Request to Vendors
                                    </button>
                                </div>
                            </form>}

                        </div>
                    </div>
                </>: <AccessDenied />}
        </>
    )
}

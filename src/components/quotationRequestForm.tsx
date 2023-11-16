'use client'
import React, { FormEvent, useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import DatePicker from "./datePicker";
import axios from "axios";
import { useRouter } from "next/navigation";
import { QuotationRequest } from "@/types/quotationRequest";
import { QuotationRequestStatus } from "@/types/enums";
import { Procurement } from "@/types/procurement";
import Image from "next/image";
import { Product } from "@/types/product";

interface VendorIdToBusinessNameMap { vendorId: string, businessName: string }

interface Props {
    quotationRequest?: QuotationRequest | null;
    isForUpdate: boolean;
    vendorIdToBusinessNameMap?: VendorIdToBusinessNameMap[];
    isViewOnly? : boolean;
}

export default function QuotationRequestForm(props: Props) {
    const router = useRouter();
    const [selectVendor, setSelectVendor] = useState<VendorIdToBusinessNameMap[] | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const isForUpdate: boolean = props.isForUpdate ? true : false;
    const [formData, setFormData] = useState<QuotationRequest>({
        quotationRequestId: props.quotationRequest ? props.quotationRequest.quotationRequestId : '',
        createdBy: props.quotationRequest ? props.quotationRequest.createdBy : '',
        updatedBy: props.quotationRequest ? props.quotationRequest.updatedBy : '',
        quotationRequestName: props.quotationRequest ? props.quotationRequest.quotationRequestName : '',
        procurementId: props.quotationRequest ? props.quotationRequest.procurementId : '',
        status: props.quotationRequest ? props.quotationRequest.status : '',
        expiryDate: props.quotationRequest ? props.quotationRequest.expiryDate : new Date(),
    });
    const [procurement, setProcurement] = useState<Procurement | null>(null)
    const [productQuantityMap, setProductQuantityMap] = useState(new Map());
    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };
    const createQuotationRequest = async (formData: QuotationRequest, vendorIds: string[]) => {
        await axios.post("/api/quotations/quotation_request/create", { quotationReq: formData, vendorsIdList: vendorIds });
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            formData.procurementId = formData.procurementId;
            formData.expiryDate = startDate ? startDate : new Date();
            formData.status = QuotationRequestStatus.ACTIVE;
            const vendorIds = selectVendor?.map((vendor: VendorIdToBusinessNameMap) => vendor.vendorId);
            if (!vendorIds || vendorIds.length === 0) { alert("Please select atleast one vendor"); return };
            let quotationRequestProducts: { [key: string]: number } = {};
            productQuantityMap.forEach((value, key) => {
                quotationRequestProducts[key] = value;
            });
            formData.quotationRequestProducts = quotationRequestProducts
            formData.productIds = procurement?.productIds
            await createQuotationRequest(formData, vendorIds);
            alert('Quotation Request Created Successfully.');
            router.push("/quotations/quotation_requests");
        } catch (error: any) {
            alert(error.message);
        }
    };
    const handleSaveAsDraft = async (e: FormEvent) => {
        e.preventDefault();
        try {
            formData.procurementId = formData.procurementId;
            formData.expiryDate = startDate ? startDate : new Date();
            formData.status = QuotationRequestStatus.DRAFT;
            const vendorIds = selectVendor?.map((vendor: VendorIdToBusinessNameMap) => vendor.vendorId);
            if (!vendorIds || vendorIds.length === 0) { alert("Please select atleast one vendor"); return };
            let quotationRequestProducts: { [key: string]: number } = {};
            productQuantityMap.forEach((value, key) => {
                quotationRequestProducts[key] = value;
            });
            formData.quotationRequestProducts = quotationRequestProducts
            formData.productIds = procurement?.productIds
            await createQuotationRequest(formData, vendorIds);
            alert('Quotation Request Save As Draft Successfully.');
            router.push("/quotations/draft_quotation_requests")
        } catch (error: any) {
            alert(error.message);
        }
    };
    const handleSearch = async () => {
        try {
            const procurementId = formData.procurementId;
            const params = {
                procurementId
            }
            const result = await axios.get(`/api/procurements`, { params: params });
            const procurement: Procurement = result.data
            setProcurement(procurement)
            const newProductQuantityMap = new Map();
            Object.entries(procurement.productsQuantity).forEach(([key, value]) => {
                newProductQuantityMap.set(key, value);
            });
            setProductQuantityMap(newProductQuantityMap);
            // Process the search result as needed
        } catch (error) {
            alert("Search failed. Please try again.");
        }
    }

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        try {
            alert("updation completed")
        } catch (error) {
            alert("Updation failed. Please try again.");
        }
        
    }


    useEffect(() => {
        if (isForUpdate) {
            handleSearch()
        }
      }, [])

    return (
        <>
            <div>
                <div className="card justify-content-center">
                    <form className="flex flex-col gap-[2rem]" onSubmit={handleSubmit}>
                        <div>

                            <h1 className="text-2xl font-bold text-custom-red mb-4">{`${ props.isViewOnly ? "": isForUpdate ? "Update": "Create"} Quotation Request`}</h1>
                            <hr className="border-custom-red border mb-4" />


                            <div className="mb-4">
                                <label className="block font-bold text-sm mb-2" htmlFor="planName">
                                    Procurement Id<span className="text-custom-red text-xs">*</span>
                                </label>
                                <input
                                    className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                                    type="text"
                                    id="procurementId"
                                    placeholder="Enter Id"
                                    defaultValue={formData.procurementId}
                                    onChange={handleChange}
                                    required
                                    readOnly={isForUpdate}
                                />
                                {!procurement && <span className="w-[12%] ml-[1rem] border border-custom-red rounded py-2 px-3 outline-none bg-custom-red cursor-pointer" onClick={handleSearch} >Search</span>}

                            </div>
                            {procurement && <>
                            <div className="mb-4">
                                <label className="block font-bold text-sm mb-2" htmlFor="planName">
                                    Quotation Request Name<span className="text-custom-red text-xs">*</span>
                                </label>
                                <input
                                    className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                                    type="text"
                                    id="quotationRequestName"
                                    placeholder="Enter Name"
                                    onChange={handleChange}
                                    required
                                    readOnly={isForUpdate}
                                    defaultValue={formData.quotationRequestName}

                                />

                            </div>
                            <div className="mb-4">
                                <label className="block font-bold text-sm mb-2" htmlFor="planName">
                                    Select Vendors<span className="text-custom-red text-xs">*</span>
                                </label>
                                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none multiselect"
                                >
                                    <MultiSelect value={selectVendor} onChange={(e: MultiSelectChangeEvent) => setSelectVendor(e.value)} options={props.vendorIdToBusinessNameMap} optionLabel="businessName"
                                        placeholder="Select Vendor" maxSelectedLabels={2} className="w-full md:w-20rem" required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold text-sm mb-2" htmlFor="planName">
                                    Expired Date<span className="text-custom-red text-xs">*</span>
                                </label>
                                <DatePicker
                                    value={new Date(startDate ?? new Date())}
                                    onChange={setStartDate}
                                />
                            </div>
                            </>}

                        </div>
                    </form>
                    {procurement && <>
                    <br />
                    <label className="block font-bold text-sm mb-2" htmlFor="planName">
                        Products<span className="text-custom-red text-xs"></span>
                    </label>
                    <br />
                    {procurement && procurement.products.map((product: Product) => (
                        <div key={product.id} className={`flex flex-row p-4 border-b-2 border-500 justify-between relative `}>
                            <div className='flex flex-row'>

                                <Image
                                    src={product.imgPath}
                                    alt={product.productName}
                                    width={100}
                                    height={100}
                                />
                                <div className="ml-4 flex flex-col gap-[5px]">
                                    <h4 className="text-lg font-medium">{product.productName}</h4>
                                    <h4 className="text-lg font-medium">{product.packSize}</h4>
                                    <div className='flex gap-[10px] items-center'>
                                        <input
                                            type="number"
                                            defaultValue={productQuantityMap.get(product.productId)}
                                            // ${"!isSellerOrderProduct  || isAlreadyOrderedProduct"? "bg-disable-grey":""}  ${!lineItem.isSellerOrderProduct || isAlreadyOrderedProduct ? "border bg-disable-grey" :""}`} key={lineItem.productId}
                                            className={` solid w-16 text-center border-2 border-custom-red`}
                                        />
                                        {/* <span>X</span>
                                        <p className="text-base font-regular">{product.sellingPrice} ₹/unit</p> */}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}

                    {!props.isViewOnly &&<div className="flex justify-center gap-[2rem] mt-[50px]">
                        <Button label="Save as Draft" type="submit" icon="pi pi-check" className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none bg-custom-red" onClick={handleSaveAsDraft} />
                        <Button label="Create" type="submit" icon="pi pi-check" className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none bg-custom-red" onClick={handleSubmit} />
                    </div>}
                    </>}

                </div>
            </div>
        </>

    )
}

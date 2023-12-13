'use client'
import React, { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import DatePickerComponent from './DatePicker'
import axios from "axios";
import { useRouter } from "next/navigation";
import { QuotationRequest } from "@/types/quotationRequest";
import Image from "next/image";
import { Product } from "@/types/product";
import Loading from "@/app/loading";
import { Vendor } from "@/types/vendor";
import { Procurement, QuotationRequestStatus } from "@prisma/client";

interface VendorIdToBusinessNameMap { vendorId: string, businessName: string }

interface Props {
    quotationRequest?: any;
    isForUpdate: boolean;
    vendorIdToBusinessNameMap?: VendorIdToBusinessNameMap[];
    isViewOnly?: boolean;
    procurementId?: string
}

export default function QuotationRequestForm(props: Props) {
    const router = useRouter();
    const [selectVendor, setSelectVendor] = useState<VendorIdToBusinessNameMap[] | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const isForUpdate: boolean = props.isForUpdate ? true : false;
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<QuotationRequest>({
        quotationRequestId: props.quotationRequest ? props.quotationRequest.quotationRequestId : '',
        createdBy: props.quotationRequest ? props.quotationRequest.createdBy : '',
        createdAt: props.quotationRequest ? props.quotationRequest.createdAt : new Date(),
        updatedBy: props.quotationRequest ? props.quotationRequest.updatedBy : '',
        quotationRequestName: props.quotationRequest ? props.quotationRequest.quotationRequestName : '',
        procurementId: props.quotationRequest ? props.quotationRequest.procurementId : '',
        status: props.quotationRequest ? props.quotationRequest.status : QuotationRequestStatus.DRAFT,
        expiryDate: props.quotationRequest ? props.quotationRequest.expiryDate : new Date(),
    });
    const [procurement, setProcurement] = useState<any>(null)
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
    const updateQuotationRequest = async (formData: QuotationRequest, quotationRequestId: string) => {
        await axios.put("/api/quotations/quotation_request/update", { quotationReq: formData, quotationRequestId });
    }

    const saveQuotationRequest = async () => {
        setLoading(true);
        const newQuotationRequest = formData;
        delete newQuotationRequest.products;
        delete newQuotationRequest.quotationRequestId;
        delete newQuotationRequest.createdAt;
        delete newQuotationRequest.updatedAt;
        const vendorIds = vendors.map((vendor) => vendor.vendorId!);
        let quotationRequestProducts: { [key: string]: number } = {};
        productQuantityMap.forEach((value, key) => {
            quotationRequestProducts[key] = value;
        });
        newQuotationRequest.quotationRequestProducts = quotationRequestProducts
        newQuotationRequest.productIds = procurement?.productIds
        newQuotationRequest.vendorIds = vendorIds;

        try {
            await Promise.all([axios.post("/api/quotations/quotation_request/create", { quotationReq: newQuotationRequest, vendorsIdList: vendorIds }), axios.put("/api/quotations/quotation_request/update", { quotationReq: { status: QuotationRequestStatus.VOID }, quotationRequestId: props.quotationRequest.quotationRequestId })]);
            alert("Quotation Request updated successfully")
        } catch (error) {
            console.log('error :>> ', error);
        }
        setLoading(false);
        window.open("/quotations/quotation_requests", "_self");
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
            router.push("/quotations/MY_QUOTATION_REQUESTS")
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleSearch = async () => {
        try {
            const procurementId = props.procurementId ? props.procurementId : formData.procurementId;

            const result = await axios.get(`/api/procurements?procurementId=${procurementId}`);
            const procurement: Procurement = result.data
            setProcurement(procurement)
            const newProductQuantityMap = new Map();
            Object.entries(props.quotationRequest? props.quotationRequest.quotationRequestProducts : procurement.productsQuantity!).forEach(([key, value]) => {
                newProductQuantityMap.set(key, value);
            });
            setProductQuantityMap(newProductQuantityMap);
            setIsLoading(false);
            // Process the search result as needed
        } catch (error) {
            setIsLoading(false);
            alert("Search failed. Please try again.");
        }
    }
    useEffect(() => {
        if (isForUpdate || props.procurementId)
            handleSearch();
    }, [])

    const handleQuantityChange = (productId: string): ChangeEventHandler<HTMLInputElement> => (e) => {
        const { value } = e.target;
        // // Update the productQuantityMap with the new quantity for the specific productId
        const updatedProductQuantityMap = new Map(productQuantityMap);
        updatedProductQuantityMap.set(productId, parseInt(value));
        setProductQuantityMap(updatedProductQuantityMap);
    };

    async function handleVoidQuotReq(): Promise<void> {
        try {
            const quotationRequestId = formData.quotationRequestId
            formData.status = QuotationRequestStatus.VOID
            await updateQuotationRequest(formData, quotationRequestId!)
            alert("Quotation request updated successfully!")
        } catch (error) {
            console.log('error :>> ', error);
        }

    }
    const [vendors, setVendors] = useState<Vendor[]>(props.quotationRequest?.vendors!)

    return (
        <>
            {loading ? <Loading /> :
                <>
                    {isForUpdate && isLoading ? <Loading /> :
                        <div>
                            <div className="card justify-content-center">
                                <h1 className="text-2xl font-bold text-custom-red mb-4">{`${props.isViewOnly ? "" : isForUpdate ? "Update" : "Create"} Quotation Request`}</h1>
                                <hr className="border-custom-red border mb-4" />
                                {!props.isViewOnly ? <form className="flex flex-col gap-[2rem]" onSubmit={handleSubmit}>
                                    <div>
                                        {isForUpdate && <div className="mb-4">
                                            <label className="block font-bold text-sm mb-2" htmlFor="planName">
                                                Quotation Request Id<span className="text-custom-red text-xs">*</span>
                                            </label>
                                            <input
                                                className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                                                type="text"
                                                id="quotationRequestId"
                                                placeholder="Enter Id"
                                                defaultValue={formData.quotationRequestId}
                                                onChange={handleChange}
                                                required
                                                readOnly={isForUpdate}
                                            />
                                        </div>}

                                        <div className="mb-4">
                                            <label className="block font-bold text-sm mb-2" htmlFor="planName">
                                                Procurement Id<span className="text-custom-red text-xs">*</span>
                                            </label>
                                            <input
                                                className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                                                type="text"
                                                id="procurementId"
                                                placeholder="Enter Id"
                                                defaultValue={props.procurementId ? props.procurementId : formData.procurementId}
                                                onChange={handleChange}
                                                required
                                                readOnly={isForUpdate}
                                            />
                                            {!procurement && <span className="w-[12%] ml-[1rem] border border-custom-red rounded py-2 px-3 outline-none bg-custom-red cursor-pointer" onClick={handleSearch} >Search</span>}

                                        </div>
                                        {procurement && <>
                                            <div className="mb-4">
                                                <label className="block font-bold text-sm mb-2" htmlFor="planName">
                                                    Quotation Request Id<span className="text-custom-red text-xs">*</span>
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
                                                <DatePickerComponent
                                                    value={new Date(startDate ?? new Date())}
                                                    onChange={setStartDate}
                                                />
                                            </div>
                                        </>}

                                    </div>
                                </form> :
                                    <>
                                        <div className="flex justify-between items-center mb-6">
                                            <div>

                                                <div className='flex'>
                                                    <p className="font-bold text-custom-gray-4">Quotation Request Id : </p><span className="text-custom-gray-4">{formData.quotationRequestId}</span>
                                                </div>
                                                <div className='flex'>
                                                    <p className="font-bold text-custom-gray-4">Quotation Request Name : </p><span className="text-custom-gray-4">{formData.quotationRequestName}</span>
                                                </div>
                                                <div className='flex'>
                                                    <p className="font-bold text-custom-gray-4">Procurement Name :  </p><span className="text-custom-gray-4">{procurement?.procurementName}</span>
                                                </div>
                                                <div className='flex'>
                                                    <p className="font-bold text-custom-gray-4">Vendors List:</p>
                                                    <ul className="text-custom-gray-4">
                                                        {vendors.map((vendor) => (
                                                            <li key={vendor.vendorId}>{vendor.businessBrandName}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className='flex'>
                                                    <p className="font-bold text-custom-gray-4">Status:  </p><span className="text-custom-gray-4">{formData.status}</span>
                                                </div>
                                                {edit ?
                                                    <div className="mb-4 flex">
                                                        <label className="font-bold text-custom-gray-4 my-auto">Expiry Date
                                                            <span className="text-custom-red">*</span>: </label>
                                                        <DatePicker
                                                            selected={new Date(formData.expiryDate ?? new Date())}
                                                            onChange={(e: any) => {
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    expiryDate: e
                                                                }))
                                                            }}
                                                            dateFormat="MMMM d, yyyy"
                                                            minDate={new Date()}
                                                            className="filter w-full px-2 border border-custom-red rounded-md cursor-pointer outline-none"
                                                        />
                                                    </div> :
                                                    <div className='flex'>
                                                        <p className="font-bold text-custom-gray-4">Expiry Date:  </p><span className="text-custom-gray-4">
                                                            {formData.expiryDate?.toDateString()}</span>
                                                    </div>}
                                            </div>

                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <div className="flex space-x-4">
                                                        <button className="bg-custom-red hover:bg-hover-red text-white px-4 py-2 rounded-md " onClick={() => setEdit(!edit)}>Edit Quotation Request</button>
                                                        <button className="bg-custom-red hover:bg-hover-red text-white px-4 py-2 rounded-md " onClick={handleVoidQuotReq}>Void Quotation Request</button>
                                                    </div>
                                                    <br />
                                                    <div className='flex'>
                                                        <p className="font-bold text-custom-gray-4">Created By: </p><span className="text-custom-gray-4">{formData.createdBy}</span>
                                                    </div>
                                                    <div className='flex'>
                                                        <p className="font-bold text-custom-gray-4">Created At: </p><span className="text-custom-gray-4">{formData.createdAt?.toDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }

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
                                                        {edit ? <input
                                                            type="number"
                                                            defaultValue={productQuantityMap.get(product.productId)}
                                                            onChange={handleQuantityChange(product.productId)}
                                                            // ${"!isSellerOrderProduct  || isAlreadyOrderedProduct"? "bg-disable-grey":""}  ${!lineItem.isSellerOrderProduct || isAlreadyOrderedProduct ? "border bg-disable-grey" :""}`} key={lineItem.productId}
                                                            className={` solid w-16 text-center border-2 border-custom-red`}
                                                        /> : <div className="">Quantity: {productQuantityMap.get(product.productId)}</div>}
                                                        {/* <span>X</span>
                                        <p className="text-base font-regular">{product.sellingPrice} ₹/unit</p> */}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ))}

                                    {!props.isViewOnly && <div className="flex justify-center gap-[2rem] mt-[50px]">
                                        <Button label="Save as Draft" type="submit" icon="pi pi-check" className="text-white w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none bg-custom-red" onClick={handleSaveAsDraft} />
                                        <Button label="Create" type="submit" icon="pi pi-check" className="text-white w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none bg-custom-red" onClick={handleSubmit} />
                                    </div>}

                                </>}

                            </div>
                        </div>}
                    {edit && <div className="mt-16"><button
                        className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0"
                        onClick={saveQuotationRequest}
                    >
                        Update Quotation
                    </button></div>}
                </>}
        </>
    )
}

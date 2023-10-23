'use client'
import React, { FormEvent, useState } from "react";
import { Button } from 'primereact/button';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import DatePicker from "./datePicker";
import axios from "axios";
import { useRouter } from "next/navigation";
import { QuotationRequest } from "@/types/quotationRequest";
import { QuotationRequestStatus } from "@/types/enums";

interface VendorIdToBusinessNameMap { vendorId: string, businessName: string }

interface Props {
    quotationRequest?: QuotationRequest | null;
    isForUpdate: boolean;
    vendorIdToBusinessNameMap?: VendorIdToBusinessNameMap[];
}

export default function QuotationForm(props: Props) {
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
    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };
    const createQuotationRequest = async (formData: QuotationRequest, vendorIds: string[]) => {
        await axios.post("/api/quotations", { quotationReq: formData, vendorsIdList: vendorIds });
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            formData.procurementId = formData.procurementId;
            formData.expiryDate = startDate ? startDate : new Date();
            formData.status = QuotationRequestStatus.ACTIVE;
            const vendorIds = selectVendor?.map((vendor: VendorIdToBusinessNameMap) => vendor.vendorId);
            if (!vendorIds || vendorIds.length === 0) { alert("Please select atleast one vendor"); return };
            await createQuotationRequest(formData, vendorIds);
            alert('Quotation Request Created Successfully.');
            router.push("/quotations/quotation_requests")
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
            await createQuotationRequest(formData, vendorIds);
            alert('Quotation Request Save As Draft Successfully.');
            router.push("/quotations/draft_quotation_requests")
        } catch (error: any) {
            alert(error.message);
        }
    };
    const handleSearch = async () => {
        try {
            const procurementId =  formData.procurementId;
            const params = {
                procurementId
            }
            const procurement = await axios.get(`/api/procurements`, { params: params });
            // Process the search result as needed
        } catch (error) {
            alert("Search failed. Please try again.");
        }
    }

    return (
        <>
            <div>
                <div className="card justify-content-center">
                    <form className="flex flex-col gap-[2rem]" onSubmit={handleSubmit}>
                        <span>

                            <input
                                className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border ${isForUpdate ? "bg-gray-300 px-4 py-2 rounded-md opacity-100" : ""} border-custom-red rounded py-2 px-3 outline-none`}
                                placeholder="Procurement Id"
                                type="text"
                                id="procurementId"
                                defaultValue={formData.procurementId}
                                onChange={handleChange}
                                required
                                readOnly={isForUpdate}
                            />
                            <Button label="Search" type="submit" className="w-[12%] ml-[1rem] border border-custom-red rounded py-2 px-3 outline-none bg-custom-red" onClick={handleSearch} />
                        </span>
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="Quotation Request Name"
                            id="quotationRequestName"
                            type="text"
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                            defaultValue={formData.quotationRequestName}
                        />
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none multiselect"
                        >
                            <MultiSelect value={selectVendor} onChange={(e: MultiSelectChangeEvent) => setSelectVendor(e.value)} options={props.vendorIdToBusinessNameMap} optionLabel="businessName"
                                placeholder="Select Vendor" maxSelectedLabels={2} className="w-full md:w-20rem" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="startDate" >
                                Expired Date
                            </label>
                            <DatePicker
                                value={new Date(startDate ?? new Date())}
                                onChange={setStartDate}
                            />
                        </div>
                        <div className="flex justify-center gap-[2rem]">
                            <Button label="Save as Draft" type="submit" icon="pi pi-check" className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none bg-custom-red" onClick={handleSaveAsDraft} />
                            <Button label="Submit" type="submit" icon="pi pi-check" className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none bg-custom-red" />
                        </div>
                    </form>
                </div>
            </div>
        </>

    )
}

'use client'
import React, { FormEvent, useState } from "react";
import { Button } from 'primereact/button';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import DatePicker from "./datePicker";
import { Quotation } from "@/types/quotation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface VendorIdToBusinessNameMap { vendorId: string, businessName : string}

interface Props {
    quotation? : any;
    isForUpdate : boolean;
    vendorIdToBusinessNameMap? : VendorIdToBusinessNameMap[];
}

export default function QuotationForm(props: Props) {
    const router = useRouter();
    const [value, setValue] = useState<string>('');
    const [selectVendor, setSelectVendor] = useState<VendorIdToBusinessNameMap [] | null >(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const isForUpdate : boolean= props.isForUpdate ? true : false;
    const [formData, setFormData] = useState<Quotation>({
        quotationId: props.quotation ? props.quotation.quotationId : '',
        createdBy: props.quotation ? props.quotation.createdBy : '',
        updatedBy: props.quotation ? props.quotation.updatedBy : '',
        quotationName: props.quotation ? props.quotation.quotationName : '',
        vendor: props.quotation ? props.quotation.vendor : '',
        vendorId: props.quotation ? props.quotation.vendorId : '',
        procurementId: props.quotation ? props.quotation.procurementId : '',
        total: props.quotation ? props.quotation.total : '',
        amount: props.quotation ? props.quotation.amount : '',
        totalTax: props.quotation ? props.quotation.totalTax : '',
        status: props.quotation ? props.quotation.status : '',
        quoteProducts: props.quotation ? props.quotation.quoteProducts : '',
        expiryDate: props.quotation ? props.quotation.quoteProducts : '',
    });
    const handleChange = (e: any) => {
        const {id , value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            formData.procurementId = "6530f337daa2c21ce218305d"; //TODO: remove this 
            formData.expiryDate = startDate ? startDate : new Date();
            const vendorIds = selectVendor?.map((vendor: VendorIdToBusinessNameMap) => vendor.vendorId);
            await axios.post("/api/quotations", {quotation : formData, vendorsIdList : vendorIds});
            alert('Quotation Created successfully.');
            router.push("/quotations");
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <>
            <div>
                <div className="card justify-content-center">
                    <form className="flex flex-col gap-[2rem]" onSubmit={handleSubmit}>
                        <input
                            className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border ${isForUpdate ? "bg-gray-300 px-4 py-2 rounded-md opacity-100": ""} border-red-500 rounded py-2 px-3 outline-none`}
                            placeholder="Procurement Id"
                            type="text"
                            id="procurementId"
                            defaultValue={formData.procurementId }
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none"
                            placeholder="Quotation Name"
                            id="quotationName"
                            type="text"
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                            defaultValue={formData.quotationName}
                        />
                        {isForUpdate ? <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none"
                            placeholder="Vendor"
                            defaultValue="text"
                            value={formData.vendorId}
                            required
                        />
                        : <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none multiselect"
                        >
                            <MultiSelect value={selectVendor} onChange={(e: MultiSelectChangeEvent) => setSelectVendor(e.value)} options={props.vendorIdToBusinessNameMap} optionLabel="businessName"
                                placeholder="Select Vendor" maxSelectedLabels={2} className="w-full md:w-20rem" required />
                        </div>}
                        <div className="mb-4">
                            <label htmlFor="startDate" >
                                Expired Date
                            </label>
                            <DatePicker
                                value={new Date(startDate ?? new Date())}
                                onChange={setStartDate}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button label="Submit" type="submit" icon="pi pi-check" className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none bg-custom-red" />
                        </div>
                    </form>
                </div>
            </div>
        </>

    )
}

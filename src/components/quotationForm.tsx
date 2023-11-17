'use client'
import React, { FormEvent, useState } from "react";
import { Button } from 'primereact/button';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import DatePicker from "./datePicker";
import { Quotation } from "@/types/quotation";

interface Vendor {
    name: string;
    email: string;
}
interface Props {
    quotation? : any;
    isForUpdate : boolean;
}

export default function QuotationForm(props: Props) {
    const [selectVendor, setSelectVendor] = useState<Vendor [] | null >(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const isForUpdate : boolean= props.isForUpdate ? true : false;
    const [formData, setFormData] = useState<Quotation>({
        quotationId: props.quotation ? props.quotation.quotationId : '',
        createdAt: props.quotation ? props.quotation.createdAt : '',
        createdBy: props.quotation ? props.quotation.createdBy : '',
        updatedBy: props.quotation ? props.quotation.updatedBy : '',
        updatedAt: props.quotation ? props.quotation.updatedAt : '',
        quotationName: props.quotation ? props.quotation.quotationName : '',
        vendors: props.quotation ? props.quotation.vendors : '',
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

    const vendors: Vendor[] = [
        { email: 'sahil.kumar@redbasil.in', name: 'Sahil Kumar' },
        { email: 'tarunrehaja@redbasil.in', name: 'Tarun Rehaja' },
        { email: 'riteshkumar@redbasil,in', name: 'Ritesh Kumar' },
        { email: 'sahilkumarsml@gamil.com', name: 'Sahil' },
        { email: 'maaz.khan@redbasil.in', name: 'Maaz Khan' }
    ];
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!selectVendor || selectVendor.length === 0) {alert("please select atleast one vendor") ;return }
    };

    return (
        <>
            <div>
                <div className="card justify-content-center">
                    <form className="flex flex-col gap-[2rem]" onSubmit={handleSubmit}>
                        <input
                            className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border ${isForUpdate ? "bg-gray-300 px-4 py-2 rounded-md opacity-100": ""} border-custom-red rounded py-2 px-3 outline-none`}
                            placeholder="Procurement Id"
                            type="text"
                            id="procurementId"
                            defaultValue={formData.procurementId }
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="Quotation Name"
                            id="quotationName"
                            type="text"
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                            defaultValue={formData.quotationName}
                        />
                        {isForUpdate ? <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="Vendor"
                            defaultValue="text"
                            value={formData.vendors.join()}
                            required
                        />
                        : <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none multiselect"
                        >
                            <MultiSelect value={selectVendor} onChange={(e: MultiSelectChangeEvent) => setSelectVendor(e.value)} options={vendors} optionLabel="email"
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
                            <Button label="Submit" type="submit" icon="pi pi-check" className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none bg-custom-red" />
                        </div>
                    </form>
                </div>
            </div>
        </>

    )
}

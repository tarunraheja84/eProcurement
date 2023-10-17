'use client'
import React, { useState } from "react";
import { Button } from 'primereact/button';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import DatePicker from "./datePicker";

interface Vendors {
    name: string;
    email: string;
}
export default function QuotationForm() {
    const [value, setValue] = useState<string>('');
    const [selectVendor, setSelectVendor] = useState<Vendors | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date());

    const vendors: Vendors[] = [
        { email: 'sahil.kumar@redbasil.in', name: 'Sahil Kumar' },
        { email: 'tarunrehaja@redbasil.in', name: 'Tarun Rehaja' },
        { email: 'riteshkumar@redbasil,in', name: 'Ritesh Kumar' },
        { email: 'sahilkumarsml@gamil.com', name: 'Sahil' },
        { email: 'maaz.khan@redbasil.in', name: 'Maaz Khan' }
    ];
    return (
        <>
            <div>
                <div className="card justify-content-center">
                    <form className="flex flex-col gap-[2rem]">
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none"
                            placeholder="Name"
                            type="text"
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none"
                            placeholder="Procurement Id"
                            type="text"
                        />
                        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none multiselect"
                        >
                            <MultiSelect value={selectVendor} onChange={(e: MultiSelectChangeEvent) => setSelectVendor(e.value)} options={vendors} optionLabel="email"
                                placeholder="Select Vendor" maxSelectedLabels={2} className="w-full md:w-20rem" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="startDate" >
                                Expired Date
                            </label>
                            <DatePicker
                                value={new Date()}
                                onChange={setStartDate}
                            />
                        </div>
                        <Button label="Submit" type="submit" icon="pi pi-check" className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none bg-custom-red" />
                    </form>
                </div>
            </div>
        </>

    )
}

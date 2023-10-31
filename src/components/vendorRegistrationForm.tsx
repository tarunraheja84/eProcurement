'use client'
import React, { FormEvent, useState } from "react";
import { Button } from 'primereact/button';
import { Vendor } from "@/types/vendor";
import axios from "axios";
import { useRouter } from "next/navigation";


interface Props {
    vendor? : any;
    isForUpdate : boolean;
}

export default function VendorRegistrationForm(props: Props) {
    const router = useRouter();
    const [value, setValue] = useState<string>('');
    const isForUpdate : boolean= props.isForUpdate ? true : false;
    const [vendorData, setVendorData] = useState<Vendor>({
        vendorId: props.vendor ? props.vendor.vendorId : null,
        businessName: props.vendor ? props.vendor.businessName : '',
        businessBrandName: props.vendor ? props.vendor.businessBrandName : '',
        gstin: props.vendor ? props.vendor.gstin : null,
        pan: props.vendor ? props.vendor.pan : undefined,
        addressLine: props.vendor ? props.vendor.addressLine : '',
        pinCode: props.vendor ? props.vendor.pinCode : '',
        city: props.vendor ? props.vendor.city : '',
        state: props.vendor ? props.vendor.state : '',
        countryCode: props.vendor ? props.vendor.countryCode : 'IND',
        phoneNumber: props.vendor ? props.vendor.phoneNumber : '',
        status: props.vendor ? props.vendor.status: "ACTIVE",
        createdBy: props.vendor ? props.vendor.createdBy : '',
        updatedBy: props.vendor ? props.vendor.updatedBy : '',
    });

    const handleChange = (e: any) => {
        const {id , value} = e.target;
        setVendorData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/vendors", vendorData);
            alert('Vendor Created successfully.');
            router.push("/vendors");
        } catch (error: any) {
            alert(error.message);
        }
    };

    const updateVendor = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/vendors/?vendorId=${vendorData.vendorId}`, vendorData);
            alert('Vendor Updated successfully.');
            router.push("/vendors");
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (
        <>
            <div>
                <div className="card justify-content-center">
                    <form className="flex flex-col gap-[2rem]" onSubmit={isForUpdate ? updateVendor : handleSubmit}>
                        <input
                            className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border ${isForUpdate ? "bg-gray-300 px-4 py-2 rounded-md opacity-100": ""} border-custom-red rounded py-2 px-3 outline-none`}
                            placeholder="Vendor Id"
                            type="text"
                            id="procurementId"
                            defaultValue={vendorData.vendorId }
                            onChange={handleChange}
                            disabled
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="Business Name"
                            id="businessName"
                            type="text"
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                            defaultValue={vendorData.businessName}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="Business Brand Name"
                            id="businessBrandName"
                            type="text"
                            onChange={handleChange}
                            defaultValue={vendorData.businessBrandName}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="GSTIN"
                            id="gstin"
                            type="text"
                            onChange={handleChange}
                            readOnly={isForUpdate}
                            defaultValue={vendorData.gstin}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="PAN"
                            id="pan"
                            type="text"
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                            defaultValue={vendorData.pan}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="Address Line"
                            id="addressLine"
                            type="text"
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                            defaultValue={vendorData.addressLine}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="Pin Code"
                            id="pinCode"
                            type="text"
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                            defaultValue={vendorData.pinCode}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="City"
                            id="city"
                            type="text"
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                            defaultValue={vendorData.city}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="State"
                            id="state"
                            type="text"
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                            defaultValue={vendorData.state}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
                            placeholder="Phone Number"
                            id="phoneNumber"
                            type="text"
                            onChange={handleChange}
                            required
                            readOnly={isForUpdate}
                            defaultValue={vendorData.phoneNumber}
                        />
                        <select name="status" id="status" required onChange={handleChange} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none">
                            <option value="ACTIVE" defaultChecked>ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                        <div className="flex justify-center">
                            <input type="submit" value={isForUpdate? "Edit Vendor": "Create Vendor"} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border text-white rounded py-2 px-3 outline-none bg-custom-red" />
                        </div>
                    </form>
                </div>
            </div>
        </>

    )
}

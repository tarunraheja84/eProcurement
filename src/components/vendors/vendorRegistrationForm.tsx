'use client'
import React, { FormEvent, useState } from "react";
import { Vendor } from "@/types/vendor";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { getPermissions } from "@/utils/helperFrontendFunctions";
import AccessDenied from "@/app/access_denied/page";


interface Props {
    vendor?: any;
    isForUpdate: boolean;
}

export default function VendorRegistrationForm(props: Props) {
    const router = useRouter();
    const isForUpdate: boolean = props.isForUpdate ? true : false;
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
        phoneNumber: props.vendor ? props.vendor.phoneNumber.split("+91")[1] : '',
        status: props.vendor ? props.vendor.status : "ACTIVE",
        createdBy: props.vendor ? props.vendor.createdBy : '',
        updatedBy: props.vendor ? props.vendor.updatedBy : '',
    });

    const [vendorUserData, setVendorUserData] = useState<any>({
        name: "",
        email: "",
        role: "USER",
        phoneNumber: "",
        createdBy: ""
    })

    const handleChange = (e: any) => {
        const { id, value } = e.target;

        if (id === "name" || id === "email" || id === "role" || id === "userPhoneNumber") {
            if (id === "userPhoneNumber") {
                setVendorUserData((prevData: User) => ({
                    ...prevData,
                    'phoneNumber': value
                }))
            }
            else {
                setVendorUserData((prevData: User) => ({
                    ...prevData,
                    [id]: value,
                }));
            }
        }
        else {
            setVendorData((prevData) => ({
                ...prevData,
                [id]: value,
            }));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const result = await axios.post("/api/vendors", vendorData);
            const vendorId = result.data.vendorId;
            await axios.post("/api/users", { ...vendorUserData, vendorId: vendorId });
            alert('Vendor Created successfully.');
            window.open("/vendors", "_self");
        } catch (error: any) {
            alert(error.message);
        }
    };

    const updateVendor = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/vendors/?vendorId=${vendorData.vendorId}`, vendorData);
            alert('Vendor Updated successfully.');
            window.open("/vendors", "_self");
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (
        <>
            {getPermissions("vendorPermissions","create") ? <div>
                <div className="card justify-content-center">
                    <form onSubmit={isForUpdate ? updateVendor : handleSubmit}>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="businessName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">Business name <span className="text-red-500">*</span></label>
                                <input type="text" id="businessName" onChange={handleChange} disabled={isForUpdate} defaultValue={vendorData.businessName} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Business Name" required />
                            </div>
                            <div>
                                <label htmlFor="businessBrandName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">Business Brand name</label>
                                <input type="text" id="businessBrandName" onChange={handleChange} defaultValue={vendorData.businessBrandName!} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Business Brand Name" />
                            </div>
                            <div>
                                <label htmlFor="gstIn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">GSTIN</label>
                                <input type="text" id="gstIn" onChange={handleChange} defaultValue={vendorData.gstin!} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9]{1}" placeholder="GSTIN" />
                            </div>
                            <div>
                                <label htmlFor="pan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">Pan number <span className="text-red-500">*</span></label>
                                <input type="text" id="pan" onChange={handleChange} disabled={isForUpdate} defaultValue={vendorData.pan} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="PAN Number" pattern="^[A-Z]{5}[0-9]{4}[A-Z]$" required />
                            </div>
                            <div>
                                <label htmlFor="addressLine" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">Address Line <span className="text-red-500">*</span></label>
                                <input type="text" id="addressLine" onChange={handleChange} defaultValue={vendorData.addressLine} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Address" required />
                            </div>
                            <div>
                                <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">City <span className="text-red-500">*</span></label>
                                <input type="text" id="city" onChange={handleChange} defaultValue={vendorData.city} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="City" required />
                            </div>
                            <div>
                                <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">State <span className="text-red-500">*</span></label>
                                <input type="text" id="state" onChange={handleChange} defaultValue={vendorData.state} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="State" required />
                            </div>
                            <div>
                                <label htmlFor="pinCode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">Pin Code <span className="text-red-500">*</span></label>
                                <input type="text" id="pinCode" onChange={handleChange} defaultValue={vendorData.pinCode} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pin Code" required />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">Phone Number <span className="text-red-500">*</span></label>
                                <input type="tel" id="phoneNumber" onChange={handleChange} defaultValue={vendorData.phoneNumber} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="[0-9]{10}" placeholder="Business Phone Number" required />
                            </div>
                        </div>
                        {
                            !isForUpdate && <>
                                <h1 className="text-lg bold underline pb-5 pt-5">Contact Person</h1>
                                <div className="mb-6">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">Name <span className="text-red-500">*</span></label>
                                    <input type="name" id="name" onChange={handleChange} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Contact Person Name" required />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">Email address <span className="text-red-500">*</span></label>
                                    <input type="email" id="email" onChange={handleChange} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="userPhoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">Phone Number <span className="text-red-500">*</span></label>
                                    <input type="tel" id="userPhoneNumber" onChange={handleChange} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="[0-9]{10}" placeholder="Phone Number" required />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-custom-buttonText">Select User Role <span className="text-red-500">*</span></label>
                                    <select name="role" id="role" required onChange={handleChange} className="bg-gray-50 border border-custom-gray-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-gray-5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-custom-buttonText dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="USER" defaultChecked>USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="MANAGER">MANAGER</option>
                                    </select>
                                </div>
                            </>
                        }
                        <button type="submit" className="text-custom-buttonText bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isForUpdate ? "Update Vendor Details" : "Create Vendor"}</button>
                    </form>

                </div>
            </div>: <AccessDenied />}
        </>

    )
}

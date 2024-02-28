'use client'
import React, { FormEvent, useState } from "react";
import { Vendor } from "@/types/vendor";
import axios from "axios";
import { GetPermissions } from "@/utils/helperFrontendFunctions";
import AccessDenied from "@/app/access_denied/page";
import { UserRole, UserStatus, VendorStatus } from "@prisma/client";
import { User } from "@/types/user";
import Loading from "@/app/loading";


interface Props {
    vendor?: any;
    isForUpdate: boolean;
}

export default function VendorRegistrationForm(props: Props) {
    const isForUpdate: boolean = props.isForUpdate ? true : false;
    const [loading, setLoading] = useState(false);
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
        status: props.vendor ? props.vendor.status : VendorStatus.ACTIVE,
        createdBy: props.vendor ? props.vendor.createdBy : '',
        updatedBy: props.vendor ? props.vendor.updatedBy : '',
    });

    const [vendorUserData, setVendorUserData] = useState<any>({
        name: "",
        email: "",
        role: UserRole.ADMIN,
        phoneNumber: "",
        status: UserStatus.ACTIVE
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
        const flag = confirm("Are you sure?");
        if (!flag) return;

        setLoading(true);
        try {
            const result = await axios.post("/api/vendors", vendorData);
            if (result.data.error && result.data.error.meta.target === "Vendor_pan_key") {
                alert("There is already a Vendor with this PAN, please change PAN.")
                return;
              }
            if (result.data.error && result.data.error.meta.target === "Vendor_businessName_key") {
                alert("There is already a Vendor with this Business Name, please change Business Name.")
                return;
              }
            if (result.data.error && result.data.error.meta.target === "Vendor_phoneNumber_key") {
                alert("There is already a Vendor with this Business Phone Number, please change Business Phone Number.")
                return;
              }
            const vendorId = result.data.vendorId;
            await axios.post("/api/vendor_users", { ...vendorUserData, vendorId: vendorId });
            alert('Vendor Created successfully.');
            window.open("/vendors", "_self");
        } catch (error: any) {
            console.log('error  :>> ', error);
        }
        setLoading(false);
    };

    const updateVendor = async (e: FormEvent) => {
        e.preventDefault();
        
        const flag = confirm("Are you sure?");
        if (!flag) return;
        setLoading(true);
        try {
            await axios.put(`/api/vendors/?vendorId=${vendorData.vendorId}`, vendorData);
            alert('Vendor Updated successfully.');
            window.open("/vendors", "_self");
        } catch (error: any) {
            console.log('error  :>> ', error);
        }
        setLoading(false);
    }

    return (
        <>
            {GetPermissions("vendorPermissions", "create") ? <div>
            {loading && <div className="absolute inset-0 z-10"><Loading /></div>}
                <div className="card justify-content-center">
                    <form onSubmit={isForUpdate ? updateVendor : handleSubmit}>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="businessName" className="block mb-2 text-sm font-medium dark:text-custom-buttonText">Business name <span className="text-custom-red">*</span></label>
                                <input type="text" id="businessName" onChange={handleChange} disabled={isForUpdate} defaultValue={vendorData.businessName} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" placeholder="Business Name" required />
                            </div>
                            <div>
                                <label htmlFor="businessBrandName" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">Business Brand name</label>
                                <input type="text" id="businessBrandName" onChange={handleChange} defaultValue={vendorData.businessBrandName!} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" placeholder="Business Brand Name" />
                            </div>
                            <div>
                                <label htmlFor="gstIn" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">GSTIN</label>
                                <input type="text" id="gstIn" onChange={handleChange} defaultValue={vendorData.gstin!} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9]{1}" placeholder="GSTIN" />
                            </div>
                            <div>
                                <label htmlFor="pan" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">Pan number <span className="text-custom-red">*</span></label>
                                <input type="text" id="pan" onChange={handleChange} disabled={isForUpdate} defaultValue={vendorData.pan} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" placeholder="PAN Number" pattern="^[A-Z]{5}[0-9]{4}[A-Z]$" required />
                            </div>
                            <div>
                                <label htmlFor="addressLine" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">Address Line <span className="text-custom-red">*</span></label>
                                <input type="text" id="addressLine" onChange={handleChange} defaultValue={vendorData.addressLine} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" placeholder="Address" required />
                            </div>
                            <div>
                                <label htmlFor="city" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">City <span className="text-custom-red">*</span></label>
                                <input type="text" id="city" onChange={handleChange} defaultValue={vendorData.city} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" placeholder="City" required />
                            </div>
                            <div>
                                <label htmlFor="state" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">State <span className="text-custom-red">*</span></label>
                                <input type="text" id="state" onChange={handleChange} defaultValue={vendorData.state} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" placeholder="State" required />
                            </div>
                            <div>
                                <label htmlFor="pinCode" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">Pin Code <span className="text-custom-red">*</span></label>
                                <input type="text" id="pinCode" onChange={handleChange} defaultValue={vendorData.pinCode} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" placeholder="Pin Code" required />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">Phone Number <span className="text-custom-red">*</span></label>
                                <input type="tel" id="phoneNumber" onChange={handleChange} defaultValue={vendorData.phoneNumber} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" 
                                pattern="(\+?\d{1,2}\s?)?(\d{10})" //checks a valid phone or telephone no. 
                                placeholder="Business Phone Number" 
                                required />
                            </div>
                        </div>
                        {
                            !isForUpdate && <>
                                <h1 className="text-lg bold underline pb-5 pt-5">Contact Person</h1>
                                <div className="mb-6">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">Name <span className="text-custom-red">*</span></label>
                                    <input type="name" id="name" onChange={handleChange} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" placeholder="Contact Person Name" required />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">Email address <span className="text-custom-red">*</span></label>
                                    <input type="email" id="email" onChange={handleChange} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" placeholder="john.doe@company.com" required />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="userPhoneNumber" className="block mb-2 text-sm font-medium  dark:text-custom-buttonText">Phone Number <span className="text-custom-red">*</span></label>
                                    <input type="tel" id="userPhoneNumber" onChange={handleChange} className="bg-custom-gray-1 border border-custom-gray-3 text-custom-gray-5 text-sm rounded-lg block w-full p-2.5 dark:bg-custom-gray-5 dark:border-custom-gray-4 dark:placeholder-custom-gray-3 dark:text-custom-buttonText outline-none" pattern="[0-9]{10}" placeholder="Phone Number" required />
                                </div>
                            </>
                        }
                        <button type="submit" className="block bg-custom-theme text-custom-buttonText hover:bg-hover-theme rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0 cursor-pointer text-center">{isForUpdate ? "Update Vendor Details" : "Create Vendor"}</button>
                    </form>

                </div>
            </div> : <AccessDenied />}
        </>

    )
}

'use client'
import React, { FormEvent, useState } from "react";
import axios from "axios";
import validator from 'validator';
import { InternalUserStatus, UserRole } from "@prisma/client";
import { User } from "@/types/user";


type Props= {
    isForVendorUser?: boolean;
    vendorUser?: User;
    vendorId?: string;
    isForInternalUser?: boolean;
    internalUser?: User;
    isForUpdate?: boolean;
}

export default function UserRegistrationForm({isForVendorUser, vendorUser, vendorId, isForInternalUser, internalUser, isForUpdate}: Props) {
    const [userData, setUserData] = useState(isForVendorUser ? {
        userId: vendorUser ? vendorUser.userId : "",
        name: vendorUser ? vendorUser.name : '',
        email: vendorUser ? vendorUser.email : '',
        phoneNumber: vendorUser ? vendorUser.phoneNumber!.split("+91")[1] : '',
        role: vendorUser ? vendorUser.role : UserRole.USER,
        vendorId: vendorId ? vendorId : "",
        createdBy: vendorUser ? vendorUser.createdBy : '',
        updatedBy: vendorUser ? vendorUser.updatedBy : '',
    } :
        {
            name: internalUser ? internalUser.name : '',
            phoneNumber: internalUser ? internalUser.phoneNumber : '',
            email: internalUser ? internalUser.email : '',
            role: internalUser ? internalUser.role : UserRole.USER,
        });

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (userData.email && !validator.isEmail(userData.email)) {
            alert("Please Enter a valid email address")
            return;
        }
        if (userData.phoneNumber && !validator.isMobilePhone(userData.phoneNumber)) {
            alert("Please Enter a valid phone number")
            return;
        }

        if (isForInternalUser) {
            try {
                const result = await axios.post("/api/users", userData);
                if (result.data.error && result.data.error.meta.target === "InternalUser_email_key") {
                    alert("Some User already exits with this email Id")
                    return;
                }
                alert('User Created Successfully.');
                window.open(`/users`, "_self");
            } catch (error: any) {
                alert(error.message);
            }
        }

        if (isForVendorUser) {
            try {
                await axios.post("/api/vendor_users", userData);
                alert('User Created Successfully.');
                window.open(`/vendors/${vendorId}/manage_users`, "_self");
            } catch (error: any) {
                alert(error.message);
            }
        }
    };

    const updateuser = async (e: FormEvent) => {
        e.preventDefault();
        if (userData.email && !validator.isEmail(userData.email)) {
            alert("Please Enter a valid email address")
            return;
        }
        if (userData.phoneNumber && !validator.isMobilePhone(userData.phoneNumber)) {
            alert("Please Enter a valid phone number")
            return;
        }

        if (isForInternalUser && internalUser) {
            try {
                const result = await axios.put("/api/users", { userData, userId: internalUser.userId });
                if (result.data.error && result.data.error.meta.target === "InternalUser_email_key") {
                    alert("Some User already exits with this email Id")
                    return;
                }
                alert('User Updated Successfully.');
                window.open(`/users`, "_self");
            } catch (error: any) {
                alert(error.message);
            }
        }

        if (isForVendorUser) {
            try {
                await axios.put(`/api/vendor_users?userId=${userData.userId}`, userData);
                alert('User Updated Successfully.');
                window.open(`/vendors/${vendorId}/manage_users`, "_self");
            } catch (error: any) {
                alert(error.message);
            }
        }
    }

    const markInactive = async (user: User) => {
        if (isForInternalUser) {
            try {
                const result = window.confirm(`Are you sure you want to mark Inactive user named ${user.name}`);
                if (result) {
                    user.status=InternalUserStatus.INACTIVE;
                    await axios.put(`/api/users`, { userData: user, userId: user.userId });
                    window.open("/users", "_self");
                }
            } catch (error: any) {
                alert(error.message);
            }
        }
    }

    const markActive = async (user: User) => {
        if (isForInternalUser) {
            try {
                const result = window.confirm(`Are you sure you want to mark active user named ${user.name}`);
                if (result) {
                    user.status=InternalUserStatus.ACTIVE;
                    await axios.put(`/api/users`, { userData: user, userId: user.userId });
                    window.open("/users", "_self");
                }
            } catch (error: any) {
                alert(error.message);
            }
        }
    }
    if(internalUser)
    console.log(internalUser.status)

    return (
        <>
            <div>
                <form onSubmit={isForUpdate ? updateuser : handleSubmit}>
                    <h1 className="text-2xl font-bold text-custom-red mb-4">{isForUpdate ? "Edit User" : "Create User"}</h1>
                    <hr className="border-custom-red border mb-4" />
                    <div className="md:flex justify-between">
                    {isForUpdate && internalUser && internalUser.status===InternalUserStatus.ACTIVE && <div className="md:hidden flex justify-end">
                            <div className="bg-custom-red hover:bg-hover-red h-10 px-2 md:px-5 py-2 md:py-3 text-white rounded-md outline-none cursor-pointer" onClick={()=>internalUser && markInactive(internalUser)}>Mark Inactive</div>
                    </div>}

                    {isForUpdate && internalUser && internalUser.status===InternalUserStatus.INACTIVE && <div className="md:hidden flex justify-end">
                            <div className="bg-custom-red hover:bg-hover-red h-12 px-5 py-3 text-white rounded-md outline-none cursor-pointer" onClick={()=>internalUser && markActive(internalUser)}>Mark Active</div>
                    </div>}
                    <div className="flex-col">
                    <div className="mb-4">
                        <label className="block font-bold text-sm mb-2">
                            Name<span className="text-custom-red text-xs">*</span>
                        </label>
                        <input
                            className="md:w-80 border border-custom-red rounded py-2 px-3 outline-none"
                            type="text"
                            id="name"
                            onChange={handleChange}
                            placeholder="Enter Name"
                            defaultValue={userData.name}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold text-sm mb-2">
                            Email Address<span className="text-custom-red text-xs">*</span>
                        </label>
                        <input
                            className="md:w-80 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                            placeholder="Enter Email Address"
                            id="email"
                            onChange={handleChange}
                            defaultValue={userData.email}
                            disabled={isForUpdate && isForInternalUser}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold text-sm mb-2">
                            Phone Number{isForVendorUser ? <span className="text-custom-red text-xs">*</span> : ""}
                        </label>
                        <input
                            className="md:w-80 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                            onChange={handleChange}
                            id="phoneNumber"
                            placeholder="Enter Phone Number"
                            defaultValue={userData.phoneNumber}
                            required={isForVendorUser}
                            pattern="[0-9]{10}"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold text-sm mb-2">
                            Select User Role<span className="text-custom-red text-xs">*</span>
                        </label>
                        <select
                            className="md:w-80 w-52 cursor-pointer border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                            onChange={handleChange}
                            id="role"
                            defaultValue={userData.role}
                            required
                        >
                            <option value="USER" defaultChecked>USER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                        </select>
                    </div>
                    </div>
                    {isForUpdate && internalUser && internalUser.status===InternalUserStatus.ACTIVE && <div className="hidden md:flex justify-end">
                            <div className="bg-custom-red hover:bg-hover-red h-12 px-5 py-3 text-white rounded-md outline-none cursor-pointer" onClick={()=>internalUser && markInactive(internalUser)}>Mark Inactive</div>
                    </div>}

                    {isForUpdate && internalUser && internalUser.status===InternalUserStatus.INACTIVE && <div className="hidden md:flex justify-end">
                            <div className="bg-custom-red hover:bg-hover-red h-12 px-5 py-3 text-white rounded-md outline-none cursor-pointer" onClick={()=>internalUser && markActive(internalUser)}>Mark Active</div>
                    </div>}

                    </div>
                    <button type="submit"
                        className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 mb-4 md:w-1/3 mx-auto text-center cursor-pointer"
                    >
                        {isForUpdate ? "Update User Details" : "Create User"}
                    </button>
                </form>
            </div>
        </>

    )
}

'use client'
import React, { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { UserStatus, UserRole } from "@prisma/client";
import { User } from "@/types/user";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { UserType } from "@/types/enums";
import InfoIcon from "@/svg/InfoIcon";
import { GetPermissions } from "@/utils/helperFrontendFunctions";
import AccessDenied from "@/app/access_denied/page";


type Props = {
    vendorUser?: User;
    vendorId?: string;
    internalUser?: User;
    isForVendorUser: boolean;
    isForUpdate: boolean;
}

export default function UserForm({ vendorUser, vendorId, internalUser, isForVendorUser, isForUpdate }: Props) {
    const session: UserSession | undefined = useSession().data?.user;
    const isVendorLogin = session?.userType === UserType.VENDOR_USER ? true : false

    const [userData, setUserData] = useState(isForVendorUser ? {
        name: vendorUser ? vendorUser.name : '',
        email: vendorUser ? vendorUser.email : '',
        phoneNumber: vendorUser ? vendorUser.phoneNumber : '',
        role: vendorUser ? vendorUser.role : UserRole.ADMIN,
        status: vendorUser ? vendorUser.status : UserStatus.ACTIVE,
        vendorId: vendorUser ? vendorUser.vendorId : vendorId ? vendorId : "",
    } :
        {
            name: internalUser ? internalUser.name : '',
            phoneNumber: internalUser ? internalUser.phoneNumber : '',
            status: internalUser ? internalUser.status : UserStatus.ACTIVE,
            email: internalUser ? internalUser.email : '',
            role: internalUser ? internalUser.role : UserRole.ADMIN,
        });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const flag = confirm("Are you sure?");
        if (!flag) return;
        try {
            setLoading(true);
            const result = await axios.post(`/api/${isForVendorUser ? "vendor_users" : "users"}`, userData);
            if (result.data.error && result.data.error.meta.target === `${!isForVendorUser ? "InternalUser" : "VendorUser"}_email_key`) {
                alert("Some User already exits with this email Id")
                return;
            }
            alert('User Created Successfully.');
            if (isVendorLogin)
                window.open(`/vendor/users`, "_self");
            else {
                if (vendorUser)
                    window.open(`/vendors/${vendorUser.vendorId}/manage_users`, "_self");
                else
                    window.open(`/users`, "_self");
            }
        } catch (error: any) {
            alert(error.message);
        }
        setLoading(false);
    };

    const updateuser = async (e: FormEvent) => {
        e.preventDefault();
        const flag = confirm("Are you sure?");
        if (!flag) return;

        if (internalUser) {
            try {
                setLoading(true);
                const result = await axios.put(`/api/${isForVendorUser ? "vendor_users" : "users"}`, { userData, userId: internalUser.userId });
                if (result.data.error && result.data.error.meta.target === "InternalUser_email_key") {
                    alert("Some User already exits with this email Id")
                    return;
                }
                alert('User Updated Successfully.');
                if (isVendorLogin)
                    window.open(`/vendor/users`, "_self");
                else {
                    if (vendorUser)
                        window.open(`/vendors/${vendorUser.vendorId}/manage_users`, "_self");
                    else
                        window.open(`/users`, "_self");
                }
            } catch (error: any) {
                alert(error.message);
            }
            setLoading(false);
        }

        if (vendorUser) {
            try {
                setLoading(true);
                await axios.put(`/api/${isForVendorUser ? "vendor_users" : "users"}`, { userData, userId: vendorUser.userId });
                alert('User Updated Successfully.');
                if (isVendorLogin)
                    window.open(`/vendor/users`, "_self");
                else {
                    if (vendorUser)
                        window.open(`/vendors/${vendorUser.vendorId}/manage_users`, "_self");
                    else
                        window.open(`/users`, "_self");
                }
            } catch (error: any) {
                alert(error.message);
            }
            setLoading(false);
        }
    }

    const markInactive = async (user: User) => {
        try {
            const result = window.confirm(`Are you sure you want to mark Inactive user named ${user.name}?`);
            if (result) {
                userData.status = UserStatus.INACTIVE;
                setLoading(true);
                await axios.put(`/api/${isForVendorUser ? "vendor_users" : "users"}`, { userData: userData, userId: user.userId });
                alert('User Updated Successfully.');
                if (isVendorLogin)
                    window.open(`/vendor/users`, "_self");
                else {
                    if (vendorUser)
                        window.open(`/vendors/${vendorUser.vendorId}/manage_users`, "_self");
                    else
                        window.open(`/users`, "_self");
                }
            }
        } catch (error: any) {
            alert(error.message);
        }
        setLoading(false);
    }

    const markActive = async (user: User) => {
        try {
            const result = window.confirm(`Are you sure you want to mark active user named ${user.name}?`);
            if (result) {
                userData.status = UserStatus.ACTIVE;
                setLoading(true);
                await axios.put(`/api/${isForVendorUser ? "vendor_users" : "users"}`, { userData: userData, userId: user.userId });
                alert('User Updated Successfully.');
                if (isVendorLogin)
                    window.open(`/vendor/users`, "_self");
                else {
                    if (vendorUser)
                        window.open(`/vendors/${vendorUser.vendorId}/manage_users`, "_self");
                    else
                        window.open(`/users`, "_self");
                }
            }
        } catch (error: any) {
            alert(error.message);
        }
        setLoading(false);
    }

    const permissions = ()=>{
        const permission1 = GetPermissions("internalUserPermissions", "create");
        const permission2 = (isForVendorUser && GetPermissions("vendorPermissions", "create"));
        const permission3 = GetPermissions("vendorUserPermissions", "create");
        return (permission1 ||  permission2 ||permission3);
    }

    return (
        <>
            {permissions() ?
                <div>
                    {loading && <div className="absolute inset-0 z-10"><Loading /></div>}
                    <form onSubmit={isForUpdate ? updateuser : handleSubmit}>
                        <h1 className="text-2xl font-bold text-custom-theme mb-4">{isForUpdate ? "Edit User" : "Create User"}</h1>
                        <hr className="border-custom-theme border mb-4" />
                        <div className="md:flex justify-between">
                            {isForUpdate && ((internalUser && internalUser.status === UserStatus.ACTIVE) || (vendorUser && vendorUser.status === UserStatus.ACTIVE)) && (GetPermissions("internalUserPermissions", "edit") || GetPermissions("vendorPermissions", "edit") || GetPermissions("vendorUserPermissions", "edit")) && <div className="md:hidden flex justify-end">
                                <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => {
                                    if (internalUser)
                                        markInactive(internalUser)
                                    if (vendorUser)
                                        markInactive(vendorUser)
                                }}>
                                    Mark Inactive</div>
                            </div>}

                            {isForUpdate && ((internalUser && internalUser.status === UserStatus.INACTIVE) || (vendorUser && vendorUser.status === UserStatus.INACTIVE)) && (GetPermissions("internalUserPermissions", "edit") || GetPermissions("vendorPermissions", "edit") || GetPermissions("vendorUserPermissions", "edit")) && <div className="md:hidden flex justify-end">
                                <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => {
                                    if (internalUser)
                                        markActive(internalUser)
                                    if (vendorUser)
                                        markActive(vendorUser)
                                }}>Mark Active</div>
                            </div>}
                            <div className="flex-col">
                                <div className="mb-4">
                                    <label className="block font-bold text-sm mb-2">
                                        Name<span className="text-custom-theme text-xs">*</span>
                                    </label>
                                    <input
                                        className="md:w-96 w-72 border border-custom-theme rounded py-2 px-3 outline-none"
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
                                        Email Address<span className="text-custom-theme text-xs">*</span>
                                    </label>
                                    <input
                                        className="md:w-96 w-72 border border-custom-theme rounded py-2 px-3 mx-auto outline-none"
                                        placeholder="Enter Email Address"
                                        type="email"
                                        id="email"
                                        onChange={handleChange}
                                        defaultValue={userData.email}
                                        disabled={isForUpdate}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block font-bold text-sm mb-2">
                                        Phone Number{isVendorLogin ? <span className="text-custom-theme text-xs">*</span> : ""}
                                    </label>
                                    <input
                                        className="md:w-96 w-72 border border-custom-theme rounded py-2 px-3 mx-auto outline-none"
                                        onChange={handleChange}
                                        id="phoneNumber"
                                        placeholder="Enter Phone Number"
                                        defaultValue={userData.phoneNumber}
                                        required={isVendorLogin}
                                        pattern="[0-9]{10}"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="flex justify-between font-bold text-sm mb-2 md:w-96 w-72">
                                        <div>Select User Role<span className="text-custom-theme text-xs">*</span></div>
                                        <div className="cursor-pointer" onClick={() => { window.open(`/rolePermissions/${vendorId ? "vendorUser" : "internalUser"}`, "_blank") }}><InfoIcon /></div>
                                    </label>
                                    <select
                                        className="md:w-96 w-72 cursor-pointer border border-custom-theme rounded py-2 px-3 mx-auto outline-none bg-white"
                                        onChange={handleChange}
                                        id="role"
                                        defaultValue={userData.role}
                                        required
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="MANAGER">MANAGER</option>
                                        <option value="USER">USER</option>
                                    </select>
                                </div>
                            </div>
                            {isForUpdate && (internalUser && internalUser.status === UserStatus.ACTIVE || vendorUser && vendorUser.status === UserStatus.ACTIVE) && <div className="hidden md:flex justify-end">
                                <div className="bg-custom-theme hover:bg-hover-theme h-12 px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => {
                                    if (internalUser)
                                        markInactive(internalUser)
                                    if (vendorUser)
                                        markInactive(vendorUser)
                                }}>Mark Inactive</div>
                            </div>}

                            {isForUpdate && (internalUser && internalUser.status === UserStatus.INACTIVE || vendorUser && vendorUser.status === UserStatus.INACTIVE) && <div className="hidden md:flex justify-end">
                                <div className="bg-custom-theme hover:bg-hover-theme h-12 px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => {
                                    if (internalUser)
                                        markActive(internalUser)
                                    if (vendorUser)
                                        markActive(vendorUser)
                                }}>Mark Active</div>
                            </div>}

                        </div>
                        <button type="submit"
                            className="block bg-custom-theme text-custom-buttonText hover:bg-hover-theme rounded p-2 md:w-1/3 mx-auto text-center cursor-pointer"
                        >
                            {isForUpdate ? "Update User Details" : "Create User"}
                        </button>
                    </form>
                </div> : <AccessDenied />}
        </>
    )
}

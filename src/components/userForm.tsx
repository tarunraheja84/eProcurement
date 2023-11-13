'use client'
import React, { FormEvent, useState } from "react";
import { VendorUser } from "@/types/vendorUser";
import axios from "axios";
import { useRouter } from "next/navigation";


interface Props {
    user?: any;
    vendorId: string;
    isForUpdate: boolean;
}

export default function UserRegistrationForm(props: Props) {
    const router = useRouter();
    const isForUpdate: boolean = props.isForUpdate ? true : false;
    const [userData, setUserData] = useState<VendorUser>({
        userId: props.user ? props.user.userId : "",
        name: props.user ? props.user.name : '',
        email: props.user ? props.user.email : '',
        phoneNumber: props.user ? props.user.phoneNumber.split("+91")[1] : null,
        role: props.user ? props.user.role : "USER",
        vendorId: props.vendorId ? props.vendorId : "",
        createdBy: props.user ? props.user.createdBy : '',
        updatedBy: props.user ? props.user.updatedBy : '',
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
        try {
            await axios.post("/api/vendor_users", userData);
            alert('User Created Successfully.');
            router.push(`/vendors/${props.vendorId}/manage_users`);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const updateuser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/vendor_users?userId=${userData.userId}`, userData);
            alert('User Updated Successfully.');
            router.push(`/vendors/${props.vendorId}/manage_users`);
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (
        <>
            <div>
                <div className="card justify-content-center">
                    <form onSubmit={isForUpdate ? updateuser : handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name <span className="text-red-500">*</span></label>
                            <input type="name" id="name" defaultValue={userData.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Contact Person Name" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address <span className="text-red-500">*</span></label>
                            <input type="email" id="email" defaultValue={userData.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number <span className="text-red-500">*</span></label>
                            <input type="tel" id="phoneNumber" defaultValue={userData.phoneNumber} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="[0-9]{10}" placeholder="Phone Number" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select User Role <span className="text-red-500">*</span></label>
                            <select name="role" id="role" defaultValue={userData.role} required onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="USER" defaultChecked>USER</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="MANAGER">MANAGER</option>
                            </select>
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isForUpdate ? "Update User Details" : "Create User"}</button>
                    </form>
                </div>
            </div>
        </>

    )
}

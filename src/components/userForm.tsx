'use client'
import React, { FormEvent, useState } from "react";
import { User } from "@/types/user";
import axios from "axios";
import { useRouter } from "next/navigation";


interface Props {
    user? : any;
    vendorId: string;
    isForUpdate : boolean;
}

export default function UserRegistrationForm(props: Props) {
    const router = useRouter();
    const isForUpdate : boolean= props.isForUpdate ? true : false;
    const [userData, setUserData] = useState<User>({
        userId: props.user ? props.user.userId : "",
        name: props.user ? props.user.name : '',
        email: props.user ? props.user.email : '',
        phoneNumber: props.user ? props.user.phoneNumber : null,
        role: props.user ? props.user.role : null,
        vendorId: props.vendorId ? props.vendorId : "",
        createdBy: props.user ? props.user.createdBy : '',
        updatedBy: props.user ? props.user.updatedBy : '',
    });

    const handleChange = (e: any) => {
        const {id , value} = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/users", userData);
            alert('user Created successfully.');
            router.push(`/vendors/${props.vendorId}/manage_users`);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const updateuser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/users?userId=${userData.userId}`, userData);
            alert('user Updated successfully.');
            router.push(`/vendors/${props.vendorId}/manage_users`);
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (
        <>
            <div>
                <div className="card justify-content-center">
                    <form className="flex flex-col gap-[2rem]" onSubmit={isForUpdate ? updateuser : handleSubmit}>
                        <input
                            className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border ${isForUpdate ? "bg-gray-300 px-4 py-2 rounded-md opacity-100": ""} border-red-500 rounded py-2 px-3 outline-none`}
                            placeholder="user Id"
                            type="text"
                            id="userId"
                            defaultValue={userData.userId}
                            onChange={handleChange}
                            disabled
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none"
                            placeholder="Name"
                            id="name"
                            type="text"
                            onChange={handleChange}
                            required
                            defaultValue={userData.name}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none"
                            placeholder="Email"
                            id="email"
                            type="text"
                            onChange={handleChange}
                            readOnly={isForUpdate}
                            defaultValue={userData.email}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none"
                            placeholder="Phone Number"
                            id="phoneNumber"
                            type="text"
                            onChange={handleChange}
                            defaultValue={userData.phoneNumber}
                        />
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none"
                            placeholder="Vendor Id"
                            id="vendorId"
                            type="text"
                            disabled
                            defaultValue={props.vendorId}
                        />
                        <select name="role" id="role" required onChange={handleChange} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-red-500 rounded py-2 px-3 outline-none">
                            <option value="USER" defaultChecked>USER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                        </select>
                        <div className="flex justify-center">
                            <input type="submit" value={isForUpdate? "Edit user": "Create user"} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border text-white rounded py-2 px-3 outline-none bg-custom-red" />
                        </div>
                    </form>
                </div>
            </div>
        </>

    )
}

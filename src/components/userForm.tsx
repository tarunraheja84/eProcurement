'use client'
import React, { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import validator from 'validator';


interface Props {
    isForVendorUser?:boolean;
    vendorUser?: any;
    vendorId?: string;
    isForInternalUser?:boolean;
    internalUser?: any;
    internalUserId?: string;
    isForUpdate: boolean;
}

export default function UserRegistrationForm(props: Props) {
    const router = useRouter();
    const isForUpdate: boolean = props.isForUpdate ? true : false;
    const [userData, setUserData] = useState(props.isForVendorUser?{
        userId: props.vendorUser ? props.vendorUser.userId : "",
        name: props.vendorUser ? props.vendorUser.name : '',
        email: props.vendorUser ? props.vendorUser.email : '',
        phoneNumber:props.vendorUser ? props.vendorUser.phoneNumber.split("+91")[1] : null,
        role: props.vendorUser ? props.vendorUser.role : "USER",
        vendorId: props.vendorId ? props.vendorId : "",
        createdBy: props.vendorUser ? props.vendorUser.createdBy : '',
        updatedBy: props.vendorUser ? props.vendorUser.updatedBy : '',
    }:
    {   
        name: props.internalUser ? props.internalUser.name : '',
        phoneNumber: props.internalUser ? props.internalUser.phoneNumber : '',
        email: props.internalUser ? props.internalUser.email : '',
        role: props.internalUser ? props.internalUser.role : "USER",
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
        if(userData.email && !validator.isEmail(userData.email)){
            alert("Please Enter a valid email address")
            return;
        }
        if(userData.phoneNumber && !validator.isMobilePhone(userData.phoneNumber)){
            alert("Please Enter a valid phone number")
            return;
        }

        if(props.isForInternalUser){
            try {
                const result=await axios.post("/api/users", userData);
                if(result.data.error && result.data.error.meta.target==="InternalUser_email_key"){
                    alert("Some User already exits with this email Id")
                    return;
                }
                alert('User Created Successfully.');
                window.open(`/users`, "_self");
            } catch (error: any) {
                alert(error.message);
            }
        }

        if(props.isForVendorUser){
            try {
                await axios.post("/api/vendor_users", userData);
                alert('User Created Successfully.');
                window.open(`/vendors/${props.vendorId}/manage_users`, "_self");
            } catch (error: any) {
                alert(error.message);
            }
        }
    };

    const updateuser = async (e: FormEvent) => {
        e.preventDefault();
        if(userData.email && !validator.isEmail(userData.email)){
            alert("Please Enter a valid email address")
            return;
        }
        if(userData.phoneNumber && !validator.isMobilePhone(userData.phoneNumber)){
            alert("Please Enter a valid phone number")
            return;
        }
        
        if(props.isForInternalUser){
            try {
                const result=await axios.put("/api/users", {userData, userId:props.internalUser.userId});
                if(result.data.error && result.data.error.meta.target==="InternalUser_email_key"){
                    alert("Some User already exits with this email Id")
                    return;
                }
                alert('User Updated Successfully.');
                window.open(`/users`, "_self");
            } catch (error: any) {
                alert(error.message);
            }
        }

        if(props.isForVendorUser){
            try {
                await axios.put(`/api/vendor_users?userId=${userData.userId}`, userData);
                alert('User Updated Successfully.');
                window.open(`/vendors/${props.vendorId}/manage_users`, "_self");
            } catch (error: any) {
                alert(error.message);
            }
        }
    }

    return (
        <>
            <div>
            <form onSubmit={isForUpdate ? updateuser : handleSubmit}>
              <h1 className="text-2xl font-bold text-custom-red mb-4">{props.isForUpdate?"Edit User":"Create User"}</h1>
              <hr className="border-custom-red border mb-4" />

              <div className="mb-4">
                <label className="block font-bold text-sm mb-2">
                Name<span className="text-custom-red text-xs">*</span>
                </label>
                <input
                  className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
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
                  className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                  placeholder="Enter Email Address"
                  id="email"
                  onChange={handleChange}
                  defaultValue={userData.email}
                  required
                />
            </div>

              <div className="mb-4">
                <label className="block font-bold text-sm mb-2">
                Phone Number{props.isForVendorUser?<span className="text-custom-red text-xs">*</span>:""}
                </label>
                <input
                  className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                  onChange={handleChange}
                  id="phoneNumber"
                  placeholder="Enter Phone Number"
                  defaultValue={userData.phoneNumber}
                  required={props.isForVendorUser}
                  pattern="[0-9]{10}"
                />
              </div>

            <div className="mb-4">
                <label className="block font-bold text-sm mb-2">
                Select User Role<span className="text-custom-red text-xs">*</span>
                </label>
                <select
                  className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                  onChange={handleChange}
                  id="role"
                  required
                >
                    <option value="USER" defaultChecked>USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                </select>
            </div>
            <button type="submit"
                className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 mb-4 md:w-1/3 mx-auto text-center cursor-pointer"
              >
                {isForUpdate ? "Update User Details" : "Create User"}
              </button>
            </form>
                {/* <div className="card justify-content-center">
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
                            <input type="tel" id="phoneNumber" defaultValue={userData.phoneNumber} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="[0-9]{10}" placeholder="Phone Number" required={props.isForVendorUser} />
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
                    </div> */}
            </div>
        </>

    )
}

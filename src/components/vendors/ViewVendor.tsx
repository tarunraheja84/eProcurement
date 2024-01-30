'use client'
import React, { useState } from 'react'
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Vendor } from '@/types/vendor';
import { signOut, useSession } from 'next-auth/react';
import { convertDateTime } from '@/utils/helperFrontendFunctions';
import axios from 'axios';
import Image from 'next/image'
import { UserType } from '@/types/enums';

const ViewVendor = ({vendor}:any) => {
    const router = useRouter()
    const vendorDetails: Vendor = props.vendorDetails;
    const session: UserSession | undefined = useSession().data?.user;
    const isVendorLogin = session?.userType === UserType.VENDOR_USER ? true : false

    const [showAddBankPopup, setShowAddBankPopup] = useState(false);
    const [bankAccount, setBankAccount] = useState({
        ifsc_code: '',
        beneficiary_name: '',
        account_type: 'current',
        account_number: '',
        holderName: '',
        email: '',
        business_name: "",
        business_type: "individual",
        vendorId : "",

    });

    const handleAddBankAccount = async (e:any) => {
        e.preventDefault();
        bankAccount.business_name = vendorDetails.businessName;
        bankAccount.vendorId = vendorDetails.vendorId!;
        try {
            await axios.post("/api/create_linked_account", bankAccount)
            setShowAddBankPopup(false);
            alert("Bank Account Details Added Successfully!")
            router.push("/vendor/profile")
        } catch (error) {
            console.log('error :>> ', error);
            alert("Bank Account Details Failed To Upload!")
        }
    };

    const handleCancel = () => {
        setBankAccount({
            ifsc_code: '',
            beneficiary_name: '',
            account_type: 'savings',
            account_number: '',
            holderName: '',
            email: '',
            business_name: "",
            business_type: "",
            vendorId : "",
        });
        setShowAddBankPopup(false);
    };

    const openPopup = () => {
        setShowAddBankPopup(true);
    };
    async function handleIfscCode(ifsc_code: string): Promise<void> {
        try {
            if (ifsc_code.length === 11) {
                const result = await axios.get(`https://ifsc.razorpay.com/${ifsc_code}`)
                setBankAccount({ ...bankAccount, ifsc_code: ifsc_code, beneficiary_name: result.data.BRANCH })
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    return (
        <>
        {isVendorLogin? 
            <>
          
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col items-center mb-8">
                    <Image className="rounded-full object-cover" src={session?.picture!} alt="" width={200} height={200} />
                    <h2 className="text-2xl font-bold mt-4">{session?.name ? session?.name : ""}</h2>
                </div>
                <div className="card bg-white rounded-md shadow-md px-4 py-8 mb-4 w-fit mx-auto">
                        <ul className="list-none">
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Email :</span>
                                <span>{props.user.email}</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Role :</span>
                                <span className="underline text-custom-link-blue cursor-pointer break-all" onClick={()=>router.push(`${isVendorLogin ? "/vendor": ""}/profile/rolePermissions`)}>{session?.role}</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Phone Number :</span>
                                <span>{props.user.phoneNumber ? props.user.phoneNumber : "-"}</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Added by :</span>
                                <span>{props.user.createdBy}</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Information updated by :</span>
                                <span>{props.user.updatedBy}</span>
                            </li>
                        </ul>
                    </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card bg-white rounded-md shadow-md px-4 py-8 w-fit">
                        <h3 className="text-xl font-bold mb-2 flex justify-center">Business Information</h3>
                        <ul className="list-none">
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Business ID :</span>
                                <span>{vendorDetails?.vendorId}</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Business Name :</span>
                                <span>{vendorDetails?.businessName}</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Business Brand Name :</span>
                                <span>{vendorDetails?.businessBrandName}</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Registration Date :</span>
                                <span>{convertDateTime(vendorDetails.createdAt!.toString())}</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Account Details :</span>
                                {vendorDetails.pgAccountId ? <>
                                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center">
                                        <svg aria-hidden="true" className="h-4 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        <span className="sr-only">Success</span>
                                    </div>
                                </> :
                                    <button type="button" className="text-gray-900 text-xs bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-bold rounded-lg p-2 text-center " onClick={openPopup}>Add + </button>
                                }
                            </li>
                        </ul>
                    </div>
                    <div className="card bg-white rounded-md shadow-md px-4 py-8 w-fit">
                        <h3 className="text-xl font-bold mb-2 flex justify-center">Business Contact Information</h3>
                        <ul className="list-none">
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Email:</span>
                                <span>{vendorDetails?.createdBy}</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Phone:</span>
                                <span>{vendorDetails?.phoneNumber}</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <span className="font-bold mr-2">Address:</span>
                                <span>{`${vendorDetails?.addressLine} , ${vendorDetails?.city} , ${vendorDetails?.state} , ${vendorDetails?.pinCode}`}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <button className="flex rounded-lg mt-8 mx-auto justify-center p-4 bg-custom-red text-white hover:bg-hover-red cursor-pointer" onClick={() => {signOut()}}>
                    Log out
                </button>
            </div>
            </>:
             <>
             <Head>
                 <title>Profile Page</title>
             </Head>
             <div className="container mx-auto max-w-4xl px-4 py-8">
                 <div className="flex flex-col items-center mb-8">
                     <Image className="rounded-full object-cover" src={session?.picture!} alt="" width={200} height={200} />
                     <h2 className="text-2xl font-bold mt-4">{session?.name ? session?.name : ""}</h2>
                 </div>
                 <div className="card bg-white rounded-md shadow-md px-4 py-8 mb-4 mx-auto">
                     <ul className="list-none flex justify-between flex-col md:flex-row">
                        <div className="">
                         <li className="flex items-center mb-2">
                             <span className="font-bold mr-2">Email :</span>
                             <span>{props.user?.email}</span>
                         </li>
                         <li className="flex items-center mb-2">
                             <span className="font-bold mr-2">Role :</span>
                             <span className="underline text-custom-link-blue cursor-pointer break-all" onClick={()=>router.push(`${isVendorLogin ? "/vendor": ""}/profile/rolePermissions`)}>{session?.role}</span>
                         </li>
                         <li className="flex items-center mb-2 md:mb-0">
                             <span className="font-bold mr-2">Phone Number :</span>
                             <span>{props.user?.phoneNumber ? props.user?.phoneNumber : "-"}</span>
                         </li>
                         </div>
                         <div className="">
                         <li className="flex items-center mb-2">
                             <span className="font-bold mr-2">Added by :</span>
                             <span>{props.user?.createdBy}</span>
                         </li>
                         <li className="flex items-center">
                             <span className="font-bold mr-2">Information updated by :</span>
                             <span>{props.user?.updatedBy}</span>
                         </li>
                         </div>
                     </ul>
                 </div>
             </div>
             <button className="flex rounded-lg mt-8 mx-auto justify-center p-4 bg-custom-red text-white hover:bg-hover-red cursor-pointer" onClick={() => { signOut() }}>
                 Log out
             </button>
         </>}
        </>
    )
}

export default ViewVendor
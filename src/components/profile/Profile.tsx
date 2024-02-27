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
import { UserRole } from '@prisma/client';

interface Props {
    vendorDetails?: any,
    user: any
}
const Profile = (props: Props) => {
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
        vendorId: "",

    });

    const handleAddBankAccount = async (e: any) => {
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
            vendorId: "",
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
            console.log('error :>> ', error);
        }
    }

    return (
        <>
            {isVendorLogin ?
                <>
                    {showAddBankPopup && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg">
                            <div className="bg-white rounded-md shadow-md">
                                <h3 className="text-lg font-semibold mb-4 px-4 pt-3 text-center">Add Bank Account</h3>
                                <form onSubmit={handleAddBankAccount} className="px-4 pb-4">
                                    <div className="mb-3 grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="business_name" className="block text-sm font-bold text-custom-gray-5 mt-2">
                                                Business Name:
                                            </label>
                                            <input
                                                type="text"
                                                id="business_name"
                                                value={vendorDetails.businessName}
                                                onChange={(e) => setBankAccount({ ...bankAccount, business_name: e.target.value })}
                                                className="border border-custom-gray-2 rounded-md p-2 w-full text-sm bg-custom-gray-2"
                                                disabled
                                            />
                                        </div>
                                        <div>

                                            <label htmlFor="business_type" className="block text-sm font-bold text-custom-gray-5 mt-2">
                                                Business Type: <span className='text-custom-red'>*</span>
                                            </label>
                                            <select
                                                id="business_type"
                                                value={bankAccount.business_type}
                                                onChange={(e) => setBankAccount({ ...bankAccount, business_type: e.target.value })}
                                                className="border border-custom-gray-2 rounded-md p-2 w-full text-sm"
                                                required
                                            >
                                                <option value="individual">Individual</option>
                                                <option value="limited liability partnerships (LLPs)">Limited liability partnerships (LLPs)</option>
                                                <option value="non-Governmental Organisation (NGO)">Non-Governmental Organisation (NGO)</option>
                                                <option value="proprietorship">Proprietorship</option>
                                                <option value="public Limited">Public Limited</option>
                                                <option value="private Limited ">Private Limited </option>
                                                <option value="trust">Trust</option>
                                                <option value="society">Society</option>
                                                <option value="educational Institutes">Educational Institutes</option>
                                                <option value="not yet registered">Not yet registered</option>
                                                <option value="other">Other</option>
                                                {/* Add other account types as options */}

                                            </select>
                                        </div>
                                        <div>


                                            <label htmlFor="holderName" className="block text-sm font-bold text-custom-gray-5 mt-2">
                                                Holder Name: <span className='text-custom-red'>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="holderName"
                                                value={bankAccount.holderName}
                                                onChange={(e) => setBankAccount({ ...bankAccount, holderName: e.target.value })}
                                                className="border border-custom-gray-2 rounded-md p-2 w-full text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-bold text-custom-gray-5 mt-2">
                                                Email: <div className='text-custom-red'>*</div>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={bankAccount.email}
                                                onChange={(e) => setBankAccount({ ...bankAccount, email: e.target.value })}
                                                className="border border-custom-gray-2 rounded-md p-2 w-full text-sm"
                                                required
                                            />
                                        </div>
                                        <div>


                                            <label htmlFor="ifsc_code" className="block text-sm font-bold text-custom-gray-5 mt-2">
                                                IFSC Code: <span className='text-custom-red'>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="ifsc_code"
                                                defaultValue={bankAccount.ifsc_code}
                                                onBlur={(e) => handleIfscCode(e.target.value)}
                                                className="border border-custom-gray-2 rounded-md p-2 w-full text-sm"
                                                pattern={'^[A-Z]{4}0[0-9]{6}$'}
                                                required
                                            />
                                        </div>
                                        <div>


                                            <label htmlFor="beneficiary_name" className="block text-sm font-bold text-custom-gray-5 mt-2">
                                                Beneficiary Name: <span className='text-custom-red'>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="beneficiary_name"
                                                value={bankAccount.beneficiary_name}
                                                onChange={(e) => setBankAccount({ ...bankAccount, beneficiary_name: e.target.value })}
                                                className="border border-custom-gray-2 rounded-md p-2 w-full text-sm"
                                                required
                                            />
                                        </div>
                                        <div>


                                            <label htmlFor="account_type" className="block text-sm font-bold text-custom-gray-5 mt-2">
                                                Account Type: <span className='text-custom-red'>*</span>
                                            </label>
                                            <select
                                                id="account_type"
                                                value={bankAccount.account_type}
                                                onChange={(e) => setBankAccount({ ...bankAccount, account_type: e.target.value })}
                                                className="border border-custom-gray-2 rounded-md p-2 w-full text-sm"
                                                required
                                            >
                                                <option value="current">Current</option>
                                                <option value="savings">Savings</option>
                                                {/* Add other account types as options */}
                                            </select>
                                        </div>
                                        <div>


                                            <label htmlFor="account_number" className="block text-sm font-bold text-custom-gray-5 mt-2">
                                                Account Number: <span className='text-custom-red'>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="account_number"
                                                value={bankAccount.account_number}
                                                onChange={(e) => setBankAccount({ ...bankAccount, account_number: e.target.value })}
                                                className="border border-custom-gray-2 rounded-md p-2 w-full text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <button
                                            type="submit"
                                            className="bg-custom-theme hover:bg-hover-theme text-custom-buttonText px-3 py-1 rounded-md mr-2 text-sm"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-custom-red hover:bg-hover-red text-custom-buttonText px-3 py-1 rounded-md text-sm"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                    }

                    <Head>
                        <title>Profile Page</title>
                    </Head>
                    <div className="container mx-auto max-w-7xl px-4 py-8">
                        <div className="flex flex-col items-center mb-8">
                            <Image className="rounded-full object-cover" src={session?.picture!} alt="" width={200} height={200} />
                            <h2 className="text-2xl font-bold mt-4">{session?.name ? session?.name : ""}</h2>
                        </div>
                        <div className="card bg-white rounded-md shadow-md px-4 py-8 mb-4 w-fit mx-auto">
                            <ul className="list-none">
                                <li className="md:flex items-center mb-2">
                                    <div className="font-bold mr-2 break-all">Email :</div>
                                    <div className="break-all">{props.user ? props.user.email : session?.email}</div>
                                </li>
                                <li className="md:flex items-center mb-2">
                                    <div className="font-bold mr-2 break-all">Role :</div>
                                    <div className="underline text-custom-link-blue cursor-pointer break-all" onClick={() => router.push(`${isVendorLogin ? "/vendor/rolePermissions" : "/rolePermissions/internalUser"}`)}>{props.user ? session?.role : UserRole.ADMIN}</div>
                                </li>
                                {props.user && <li className="md:flex items-center mb-2">
                                    <div className="font-bold mr-2 break-all">Phone Number :</div>
                                    <div className="break-all">{props.user.phoneNumber ? props.user.phoneNumber : "-"}</div>
                                </li>}
                                <li className="md:flex items-center mb-2">
                                    <div className="font-bold mr-2 break-all">Added by :</div>
                                    <div className="break-all">{props.user ? props.user.createdBy : <span className="text-custom-yellow">Spoofing Activity</span>}</div>
                                </li>
                                <li className="md:flex items-center mb-2">
                                    <div className="font-bold mr-2 break-all">Information updated by :</div>
                                    <div className="break-all">{props.user ? props.user.updatedBy : <span className="text-custom-yellow">Spoofing Activity</span>}</div>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-80">
                            <div className="card bg-white rounded-md shadow-md px-4 py-8 w-fit">
                                <h3 className="text-xl font-bold mb-2 flex justify-center">Business Information</h3>
                                <ul className="list-none">
                                    <li className="md:flex items-center mb-2">
                                        <div className="font-bold mr-2 break-all">Business Name :</div>
                                        <div className="break-all">{vendorDetails?.businessName}</div>
                                    </li>
                                    <li className="md:flex items-center mb-2">
                                        <div className="font-bold mr-2 break-all">Business Brand Name :</div>
                                        <div className="break-all">{vendorDetails?.businessBrandName}</div>
                                    </li>
                                    <li className="flex items-center mb-2">
                                        <span className="font-bold mr-2">PAN :</span>
                                        <span>{vendorDetails?.pan}</span>
                                    </li>
                                    <li className="flex items-center mb-2">
                                        <span className="font-bold mr-2">GSTIN :</span>
                                        <span>{vendorDetails.gstin ? vendorDetails.gstin : "-"}</span>
                                    </li>
                                    <li className="flex items-center mb-2">
                                        <span className="font-bold mr-2">Registration Date :</span>
                                        <span>{convertDateTime(vendorDetails.createdAt!.toString())}</span>
                                    </li>
                                    <li className="md:flex items-center mb-2">
                                        <div className="font-bold mr-2 break-all">PG Account Id :</div>
                                        {vendorDetails.pgAccountId ? vendorDetails.pgAccountId :
                                            <button type="button" className="text-custom-gray-5 text-xs bg-gradient-to-r from-custom-green to-hover-green hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-custom-green dark:focus:ring-hover-green font-bold rounded-lg p-2 text-center " onClick={openPopup}>Add + </button>
                                        }
                                    </li>
                                </ul>
                            </div>
                            <div className="card bg-white rounded-md shadow-md px-4 py-8 w-fit">
                                <h3 className="text-xl font-bold mb-2 flex justify-center">Business Contact Information</h3>
                                <ul className="list-none">
                                    <li className="md:flex items-center mb-2">
                                        <div className="font-bold mr-2 break-all">Email:</div>
                                        <div className="break-all">{vendorDetails?.createdBy}</div>
                                    </li>
                                    <li className="md:flex items-center mb-2">
                                        <div className="font-bold mr-2 break-all">Phone:</div>
                                        <div className="break-all">{vendorDetails?.phoneNumber}</div>
                                    </li>
                                    <li className="md:flex items-center mb-2">
                                        <div className="font-bold mr-2 break-all">Address:</div>
                                        <div className="break-all">{`${vendorDetails?.addressLine} , ${vendorDetails?.city} , ${vendorDetails?.state} , ${vendorDetails?.pinCode}`}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <button className="flex rounded-lg mt-8 mx-auto justify-center p-4 bg-custom-red text-custom-buttonText hover:bg-hover-red cursor-pointer" onClick={() => { signOut() }}>
                            Log out
                        </button>
                    </div>
                </> :
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
                                        <div className="font-bold mr-2 break-all">Email :</div>
                                        <div className="break-all">{props.user?.email}</div>
                                    </li>
                                    <li className="flex items-center mb-2">
                                        <div className="font-bold mr-2 break-all">Role :</div>
                                        <div className="underline text-custom-link-blue cursor-pointer break-all" onClick={() => router.push(`${isVendorLogin ? "/vendor/rolePermissions" : "/rolePermissions/internalUser"}`)}>{session?.role}</div>
                                    </li>
                                    <li className="flex items-center mb-2 md:mb-0">
                                        <div className="font-bold mr-2 break-all">Phone Number :</div>
                                        <div className="break-all">{props.user?.phoneNumber ? props.user?.phoneNumber : "-"}</div>
                                    </li>
                                </div>
                                <div className="">
                                    <li className="flex items-center mb-2">
                                        <div className="font-bold mr-2 break-all">Added by :</div>
                                        <div className="break-all">{props.user?.createdBy}</div>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="font-bold mr-2 break-all">Information updated by :</div>
                                        <div className="break-all">{props.user?.updatedBy}</div>
                                    </li>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <button className="flex rounded-lg mt-8 mx-auto justify-center p-4 bg-custom-red text-custom-buttonText hover:bg-hover-red cursor-pointer" onClick={() => { signOut() }}>
                        Log out
                    </button>
                </>}
        </>
    )
}

export default Profile
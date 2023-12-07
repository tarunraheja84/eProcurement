'use client'
import React from 'react'
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Vendor } from '@/types/vendor';
import { useSession } from 'next-auth/react';
import { convertDateTime } from '@/utils/helperFrontendFunctions';


interface Props {
    vendorDetails: Vendor
}
const Profile = (props: Props) => {
    const router = useRouter()
    const vendorDetails : Vendor= props.vendorDetails;
    const session: UserSession | undefined = useSession().data?.user;
    return (
        <>
            <Head>
                <title>Profile Page</title>
            </Head>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={session?.picture ?? ""}
                        alt="Profile Picture"
                        className="w-48 h-48 rounded-full object-cover"
                    />
                    <h2 className="text-2xl font-bold mt-4">{vendorDetails?.businessName}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card bg-white rounded-md shadow-md px-4 py-8">
                        <h3 className="text-xl font-bold mb-2">Business Information</h3>
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
                        </ul>
                    </div>
                    <div className="card bg-white rounded-md shadow-md px-4 py-8">
                        <h3 className="text-xl font-bold mb-2">Contact Information</h3>
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
                <button className="flex rounded-lg mt-[1rem] justify-center p-2 m-auto bg-custom-red hover:bg-hover-red cursor-pointer" onClick={() => router.push(`/vendor/manage_users`)}>
                    Manage Users
                </button>
            </div>
        </>
    )
}

export default Profile
'use client'
import React from 'react'
import { convertDateTime, getPermissions } from '@/utils/helperFrontendFunctions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Props {
    vendorDetails?: any,
    user: any
}
const ViewVendor = (props: Props) => {
    const vendorDetails = props.vendorDetails;
    const router = useRouter();
    return (
        <>
            <div className="flex flex-col md:flex-row gap-2 justify-end items-end">
                {getPermissions("vendorPermissions", "view") && <div className="flex items-center pb-2 md:pb-4">
                    <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-white rounded-md outline-none cursor-pointer" onClick={() => router.push(`/quotations/active_quotation/${vendorDetails.vendorId}`)}>View Active Quotation</div>
                </div>}
                {getPermissions("vendorPermissions", "view") && <div className="flex items-center pb-2 md:pb-4">
                    <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-white rounded-md outline-none cursor-pointer" onClick={() => router.push(`/vendors/${vendorDetails.vendorId}/manage_users`)}>Manage Users</div>
                </div>}
                {getPermissions("paymentPermissions","edit") && <div className="flex items-center pb-2 md:pb-4">
                    <div className="text-white bg-custom-yellow hover:bg-hover-yellow px-3 py-2 md:px-5 md:py-3 outline-none cursor-pointer rounded-md" onClick={() => router.push(`/payments/prepaid_payments/${vendorDetails.vendorId}`)}>₹ Pay Now</div>
                </div>}
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col items-center mb-8">
                    <Image onClick={() => { router.push('/profile') }} className="rounded-full cursor-pointer" src={"/emptyProfile.jpg"} alt="" width={200} height={200} />
                    <h2 className="text-2xl font-bold mt-4">{vendorDetails?.businessName}</h2>
                </div>
                <div className="card bg-white rounded-md shadow-md px-4 py-8 mb-4 w-fit mx-auto">
                    <ul className="list-none">
                        <li className="flex items-center mb-2">
                            <span className="font-bold mr-2">Contact Person :</span>
                            <span>{props.user.name}</span>
                        </li>
                        <li className="flex items-center mb-2">
                            <span className="font-bold mr-2">Email :</span>
                            <span>{props.user.email}</span>
                        </li>
                        <li className="flex items-center mb-2">
                            <span className="font-bold mr-2">Role :</span>
                            <span className="underline text-custom-link-blue cursor-pointer break-all" onClick={() => router.push(`/rolePermissions/vendorUser`)}>{props.user?.role}</span>
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
                                {vendorDetails.pgAccountId ? vendorDetails.pgAccountId : <span className="text-custom-yellow">Not Added yet</span>}
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
            </div>
        </>
    )
}

export default ViewVendor
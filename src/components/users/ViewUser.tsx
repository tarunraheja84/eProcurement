'use client'
import React from 'react'
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import { convertDateTime, usePermissions } from '@/utils/helperFrontendFunctions';
import Image from 'next/image'
import { UserType } from '@/types/enums';
import AccessDenied from '@/app/access_denied/page';

interface Props {
    vendor?: any,
    user: any
}
const ViewUser = ({ vendor, user }: Props) => {
    const session: UserSession | undefined = useSession().data?.user;
    const isVendorLogin = session?.userType === UserType.VENDOR_USER ? true : false
    const router = useRouter();

    return (
        <>
            <div className={`flex flex-col md:flex-row gap-2 justify-end items-end`}>
                {(usePermissions("internalUserPermissions", "edit") || usePermissions("vendorPermissions", "edit") || usePermissions("vendorUserPermissions", "edit")) && <div className="flex items-center pb-2 md:pb-4">
                    <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => isVendorLogin ?
                        router.push(`/vendor/users/${user.userId}/edit`) : vendor ? router.push(`/vendor_users/${user.userId}/edit`) : router.push(`/users/${user.userId}/edit`)}>Edit User</div>
                </div>}
            </div>
            
            {(usePermissions("internalUserPermissions", "view") || (vendor && usePermissions("vendorPermissions", "view")) || usePermissions("vendorUserPermissions", "view")) ?
                <>
                    {vendor ?
                        <>
                            <div className="container mx-auto max-w-7xl px-4 py-8">
                                <div className="flex flex-col items-center mb-8">
                                    <Image className="rounded-full cursor-pointer" src={"/emptyProfile.jpg"} alt="" width={200} height={200} />
                                    <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
                                </div>
                                <div className="card bg-white rounded-md shadow-md px-4 py-8 mb-4 w-fit mx-auto">
                                    <ul className="list-none">
                                        <li className="md:flex items-center mb-2">
                                            <div className="font-bold mr-2 break-all">Email :</div>
                                            <div className="break-all">{user.email}</div>
                                        </li>
                                        <li className="md:flex items-center mb-2">
                                            <div className="font-bold mr-2 break-all">Role :</div>
                                            <div className="underline text-custom-link-blue cursor-pointer break-all" onClick={() => router.push(`${vendor ? "/vendor/rolePermissions" : "/rolePermissions/internalUser"}`)}>{user?.role}</div>
                                        </li>
                                        <li className="md:flex items-center mb-2">
                                            <div className="font-bold mr-2 break-all">Phone Number :</div>
                                            <div className="break-all">{user.phoneNumber ? user.phoneNumber : "-"}</div>
                                        </li>
                                        <li className="md:flex items-center mb-2">
                                            <div className="font-bold mr-2 break-all">Added by :</div>
                                            <div className="break-all">{user.createdBy}</div>
                                        </li>
                                        <li className="md:flex items-center mb-2">
                                            <div className="font-bold mr-2 break-all">Information updated by :</div>
                                            <div className="break-all">{user.updatedBy}</div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-80">
                                    <div className="card bg-white rounded-md shadow-md px-4 py-8 w-fit">
                                        <h3 className="text-xl font-bold mb-2 flex justify-center">Business Information</h3>
                                        <ul className="list-none">
                                            <li className="md:flex items-center mb-2">
                                                <div className="font-bold mr-2 break-all">Vendor ID :</div>
                                                <div className="break-all">{vendor?.vendorId}</div>
                                            </li>
                                            <li className="md:flex items-center mb-2">
                                                <div className="font-bold mr-2 break-all">Business Name :</div>
                                                <div className="break-all">{vendor?.businessName}</div>
                                            </li>
                                            <li className="md:flex items-center mb-2">
                                                <div className="font-bold mr-2 break-all">Business Brand Name :</div>
                                                <div className="break-all">{vendor?.businessBrandName}</div>
                                            </li>
                                            <li className="flex items-center mb-2">
                                                <span className="font-bold mr-2">PAN :</span>
                                                <span>{vendor?.pan}</span>
                                            </li>
                                            <li className="flex items-center mb-2">
                                                <span className="font-bold mr-2">GSTIN :</span>
                                                <span>{vendor.gstin ? vendor.gstin : "-"}</span>
                                            </li>
                                            <li className="flex items-center mb-2">
                                                <span className="font-bold mr-2">PG Account Id :</span>
                                                {vendor.pgAccountId ? vendor.pgAccountId : "-"}
                                            </li>
                                            <li className="flex items-center mb-2">
                                                <span className="font-bold mr-2">Registration Date :</span>
                                                <span>{convertDateTime(vendor.createdAt!.toString())}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card bg-white rounded-md shadow-md px-4 py-8 w-fit">
                                        <h3 className="text-xl font-bold mb-2 flex justify-center">Business Contact Information</h3>
                                        <ul className="list-none">
                                            <li className="md:flex items-center mb-2">
                                                <div className="font-bold mr-2 break-all">Email:</div>
                                                <div className="break-all">{vendor?.createdBy}</div>
                                            </li>
                                            <li className="md:flex items-center mb-2">
                                                <div className="font-bold mr-2 break-all">Phone:</div>
                                                <div className="break-all">{vendor?.phoneNumber}</div>
                                            </li>
                                            <li className="md:flex items-center mb-2">
                                                <div className="font-bold mr-2 break-all">Address:</div>
                                                <div className="break-all">{`${vendor?.addressLine} , ${vendor?.city} , ${vendor?.state} , ${vendor?.pinCode}`}</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </> :
                        <>
                            <div className="container mx-auto max-w-4xl px-4 py-8">
                                <div className="flex flex-col items-center mb-8">
                                    <Image className="rounded-full cursor-pointer" src={"/emptyProfile.jpg"} alt="" width={200} height={200} />
                                    <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
                                </div>
                                <div className="card bg-white rounded-md shadow-md px-4 py-8 mb-4 mx-auto">
                                    <ul className="list-none flex justify-between flex-col md:flex-row">
                                        <div className="">
                                            <li className="flex items-center mb-2">
                                                <div className="font-bold mr-2 break-all">Email :</div>
                                                <div className="break-all">{user?.email}</div>
                                            </li>
                                            <li className="flex items-center mb-2">
                                                <div className="font-bold mr-2 break-all">Role :</div>
                                                <div className="underline text-custom-link-blue cursor-pointer break-all" onClick={() => router.push(`${isVendorLogin ? "/vendor/rolePermissions" : "/rolePermissions/internalUser"}`)}>{user?.role}</div>
                                            </li>
                                            <li className="flex items-center mb-2 md:mb-0">
                                                <div className="font-bold mr-2 break-all">Phone Number :</div>
                                                <div className="break-all">{user?.phoneNumber ? user?.phoneNumber : "-"}</div>
                                            </li>
                                        </div>
                                        <div className="">
                                            <li className="flex items-center mb-2">
                                                <div className="font-bold mr-2 break-all">Added by :</div>
                                                <div className="break-all">{user?.createdBy}</div>
                                            </li>
                                            <li className="flex items-center">
                                                <div className="font-bold mr-2 break-all">Information updated by :</div>
                                                <div className="break-all">{user?.updatedBy}</div>
                                            </li>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </>}
                </> : <AccessDenied />}
        </>
    )
}

export default ViewUser
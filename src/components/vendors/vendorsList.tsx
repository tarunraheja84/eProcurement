'use client'
import { Vendor } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import Image from "next/image";
import AccessDenied from '@/app/access_denied/page';
import { getPermissions } from '@/utils/helperFrontendFunctions';

type Props = {
    vendors: Vendor[]
}

const VendorsList = (props: Props) => {
    const router = useRouter();
  return (
    <>
    {getPermissions("vendorPermissions","view") ? <div className="overflow-x-auto">
        <table className="table-auto w-full border border-black">
            <thead>
                <tr className="bg-custom-gray-1">
                    <th className="p-2 text-center border-r">S. No.</th>
                    <th className="p-2 text-center border-r">Business Name</th>
                    <th className="p-2 text-center border-r">Business Brand Name</th>
                    <th className="p-2 text-center border-r">Created By</th>
                    <th className={`p-2 text-center ${getPermissions("vendorPermissions", "view")?"":"border-r"}`}>Created At</th>
                    {getPermissions("vendorPermissions", "edit") && <th className="p-2 text-center ">Edit</th>}
                    {getPermissions("internalUserPermissions", "view") && <th className="p-2 text-center">Manage Users</th>}
                    {getPermissions("paymentPermissions","edit") && <th className="p-2 text-center"></th>}
                </tr>
            </thead>
            <tbody>
            {props.vendors.map((vendor: Vendor,index:number) => (
                    <tr key={index} className="border-b border-black">
                        <td className="p-2 text-center border-r align-middle">{index+1}</td>
                        <td className="p-2 text-center border-r align-middle"><span className="underline text-custom-link-blue cursor-pointer break-all" onClick={()=>router.push(`/quotations/active_quotation/${vendor.vendorId}`)}>{vendor.businessName}</span></td>
                        <td className="p-2 text-center border-r align-middle">{vendor.businessBrandName}</td>
                        <td className="p-2 text-center border-r align-middle">{vendor.createdBy}</td>
                        <td className={`p-2 text-center ${getPermissions("vendorPermissions", "view")?"":"border-r"} align-middle`}>{vendor.createdAt?.toDateString()}</td>
                        {getPermissions("vendorPermissions", "edit") && <td className="p-2 text-center border-r align-middle">
                            <button className='bg-custom-theme rounded-lg p-2 hover:bg-hover-theme text-white pi pi-pencil' onClick={() => router.push(`/vendors/${vendor.vendorId}/edit`)}></button>
                        </td>}
                        {getPermissions("internalUserPermissions", "view") && <td className="p-2 text-center align-middle">
                            <button className='bg-custom-theme p-2 rounded-lg hover:bg-hover-theme text-white' onClick={() => router.push(`/vendors/${vendor.vendorId}/manage_users`)}>Manage Users</button>
                        </td>}
                        {getPermissions("paymentPermissions","edit") && <td>
                            <button type="button" className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2" onClick={() => router.push(`/payments/prepaid_payments/${vendor.vendorId}`)}>
                                <Image
                                    src="/rupee.svg"
                                    alt="Access Denied"
                                    width={15}
                                    height={15}
                                    />
                                Pay Now
                            </button>
                        </td>}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>: <AccessDenied />}
    </>
  )
}

export default VendorsList

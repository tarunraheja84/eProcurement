'use client'
import { Vendor } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import Image from "next/image";

type Props = {
    vendors: Vendor[]
}

const VendorsList = (props: Props) => {
    const router = useRouter();
  return (
    <div className="overflow-x-auto">
        <table className="table-auto w-full border border-black">
            <thead>
                <tr className="bg-gray-200">
                    <th className="p-2 text-center border-r">Business Name</th>
                    <th className="p-2 text-center border-r">Business Brand Name</th>
                    <th className="p-2 text-center border-r">Created At</th>
                    <th className="p-2 text-center border-r">Updated At</th>
                    <th className="p-2 text-center ">Edit</th>
                    <th className="p-2 text-center">Manage Users</th>
                    <th className="p-2 text-center"></th>
                </tr>
            </thead>
            <tbody>
            {props.vendors.map((vendor: Vendor) => (
                    <tr key={vendor.vendorId} className="border-b border-black">
                        <td className="p-2 text-center border-r align-middle">{vendor.businessName}</td>
                        <td className="p-2 text-center border-r align-middle">{vendor.businessBrandName}</td>
                        <td className="p-2 text-center border-r align-middle">{vendor.createdAt?.toDateString()}</td>
                        <td className="p-2 text-center border-r align-middle">{vendor.updatedAt?.toDateString()}</td>
                        <td className="p-2 text-center border-r align-middle">
                            <button className='bg-custom-red rounded-lg p-2 hover:bg-hover-red text-white pi pi-pencil' onClick={() => router.push(`/admin/vendors/${vendor.vendorId}/edit`)}></button>
                        </td>
                        <td className="p-2 text-center align-middle">
                            <button className='bg-custom-red p-2 rounded-lg hover:bg-hover-red text-white' onClick={() => router.push(`/admin/vendors/${vendor.vendorId}/manage_users`)}>Manage Users</button>
                        </td>
                        <td>
                            <button type="button" className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2" onClick={() => router.push(`/payments/prepaid_payments/${vendor.vendorId}`)}>
                                <Image
                                    src="/rupee.svg"
                                    alt="Access Denied"
                                    width={15}
                                    height={15}
                                    />
                                Pay Now
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default VendorsList

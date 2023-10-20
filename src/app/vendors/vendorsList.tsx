'use client'
import { Vendor } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import React from 'react'

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
                    <th className="p-2 text-center">Edit</th>
                    <th className="p-2 text-center">Manage Users</th>
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
                            <Button className='bg-custom-red px-5 py-2 text-white' onClick={() => router.push(`/vendors/${vendor.vendorId}/edit`)}>Edit</Button>
                        </td>
                        <td className="p-2 text-center align-middle">
                            <Button className='bg-custom-red px-5 py-2 text-white' onClick={() => router.push(`/vendors/${vendor.vendorId}/manage_users`)}>Manage Users</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default VendorsList

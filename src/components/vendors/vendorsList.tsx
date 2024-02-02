'use client'
import { Vendor } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
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
                    {getPermissions("vendorPermissions", "view") && <th className="p-2 text-center "></th>}
                </tr>
            </thead>
            <tbody>
            {props.vendors.map((vendor: Vendor,index:number) => (
                    <tr key={index} className="border-b border-black">
                        <td className="p-2 text-center border-r align-middle">{index+1}</td>
                        <td className="p-2 text-center border-r align-middle">{vendor.businessName}</td>
                        <td className="p-2 text-center border-r align-middle">{vendor.businessBrandName}</td>
                        <td className="p-2 text-center border-r align-middle">{vendor.createdBy}</td>
                        <td className={`p-2 text-center border-r align-middle ${getPermissions("vendorPermissions", "view")?"":"border-r"} align-middle`}>{vendor.createdAt?.toDateString()}</td>
                        {getPermissions("vendorPermissions", "edit") && <td className="p-2 text-center align-middle"><button className={'bg-custom-theme hover:bg-hover-theme px-5 py-2 text-white rounded-md'} onClick={() => router.push(`/vendors/${vendor.vendorId}/view`)}>View</button>
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

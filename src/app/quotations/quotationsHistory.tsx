'use client'
import { Quotation, Vendor } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import React from 'react'

type Props = {
    quotations: Quotation[]
}

const QuotationHistory = (props: Props) => {
    const router = useRouter();
  return (
    <div className='overflow-x-auto'>
        <table className="table-auto w-full border border-black">
            <thead>
                <tr className="bg-gray-200">
                    <th className="p-2 text-center border-r">Quotation Name</th>
                    <th className="p-2 text-center border-r">Status</th>
                    <th className="p-2 text-center border-r">Vendor Id</th>
                    <th className="p-2 text-center border-r">Procurement Id</th>
                    <th className="p-2 text-center border-r">Created At</th>
                    <th className="p-2 text-center border-r">Updated At</th>
                    <th className="p-2 text-center border-r">Created By</th>
                    <th className="p-2 text-center border-r">Updated By</th>
                    <th className="p-2 text-center">Edit</th>
                </tr>
            </thead>
            <tbody>
            {props.quotations.map((quotation: Quotation) => (
                    <tr key={quotation.quotationId} className="border-b border-black">
                        <td className="p-2 text-center border-r align-middle">{quotation.quotationName}</td>
                        <td className="p-2 text-center border-r align-middle">{quotation.status}</td>
                        <td className="p-2 text-center border-r align-middle">{quotation.vendorId}</td>
                        <td className="p-2 text-center border-r align-middle">{quotation.procurementId}</td>
                        <td className="p-2 text-center border-r align-middle">{quotation.createdAt?.toDateString()}</td>
                        <td className="p-2 text-center border-r align-middle">{quotation.updatedAt?.toDateString()}</td>
                        <td className="p-2 text-center border-r align-middle">{quotation.createdBy}</td>
                        <td className="p-2 text-center border-r align-middle">{quotation.updatedBy}</td>
                        <td className="p-2 text-center align-middle">
                            <Button className='bg-custom-red px-5 py-2 text-white' onClick={() => router.push(`/quotations/${quotation.quotationId}`)}>Edit</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default QuotationHistory

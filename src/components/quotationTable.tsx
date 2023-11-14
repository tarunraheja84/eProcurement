'use client'
import { Quotation } from '@/types/quotation'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import React from 'react'

type Props = {
    quotations: Quotation[]
}

const QuotationTable = (props: Props) => {
    const router = useRouter();
  return (
    <div className='overflow-x-auto'>
        <table className="table-auto w-full border border-black">
            <thead>
                <tr className="bg-gray-200">
                    <th className="p-2 text-center border-r">Quotation Name</th>
                    <th className="p-2 text-center border-r">Quotation Status</th>
                    <th className="p-2 text-center border-r">Vendor Name</th>
                    <th className="p-2 text-center border-r">Procurement Id</th>
                    <th className="p-2 text-center border-r">Expired Date</th>
                    <th className="p-2 text-center"></th>
                    <th className="p-2 text-center"></th>
                </tr>
            </thead>
            <tbody>
            {props.quotations.map((quotation: Quotation) => (
                    <tr key={quotation.quotationId} className="border-b border-black">
                        <td className="p-2 text-center border-r align-middle">{quotation.quotationName}</td>
                        <td className="p-2 text-center border-r align-middle">{quotation.status}</td>
                        <td className="p-2  text-center border-r align-middle">{quotation.vendor?.businessName}</td>
                        <td className="p-2 text-center border-r align-middle">{quotation.procurement?.procurementName}</td>
                        <td className="p-2 text-center border-r align-middle">{quotation.expiryDate?.toDateString()}</td>
                        <td className='bg-custom-red p-2 text-white pi pi-eye rounded-lg m-2 ' onClick={() => router.push(`/quotations`)}></td>
                        <td className="p-2 align-middle">
                            <Button className='bg-custom-red text-white pi pi-shopping-cart p-2' onClick={() => router.push(`/orders/create/${quotation.quotationId}`)}> Purchase</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default QuotationTable

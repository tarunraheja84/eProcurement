'use client'
import { QuotationRequestStatus } from '@/types/enums'
import { QuotationRequest } from '@/types/quotationRequest'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import React from 'react'

type Props = {
    quotationRequests: QuotationRequest[]
}

const QuotationRequestsTable = (props: Props) => {
    const router = useRouter();
  return (
    <div className='overflow-x-auto'>
        <table className="table-auto w-full border border-black">
            <thead>
                <tr className="bg-gray-200">
                    <th className="p-2 text-center border-r">Quotation Request</th>
                    <th className="p-2 text-center border-r">Quotation Req. Status</th>
                    <th className="p-2 text-center border-r">Vendors</th>
                    <th className="p-2 text-center border-r">Procurement</th>
                    <th className="p-2 text-center border-r">Created By</th>
                    <th className="p-2 text-center border-r">Expired Date</th>
                    <th className="p-2 text-center"></th>
                </tr>
            </thead>
            <tbody>
            {props.quotationRequests.map((quotationReq: QuotationRequest) => (
                    <tr key={quotationReq.quotationRequestId} className="border-b border-black">
                        <td className="p-2 text-center border-r align-middle">{quotationReq.quotationRequestName}</td>
                        <td className="p-2 text-center border-r align-middle">{quotationReq.status === "ACTIVE" ? "SENT" : quotationReq.status}</td>
                        <td className="p-2 text-center border-r align-middle w-[300px]">
                            {quotationReq.vendors?.map((vendor, index) => (
                                <div key={vendor.vendorId}>
                                    <p><strong>Business Name: </strong> {vendor.businessName}</p>
                                    {/* <p><strong>status: </strong> {vendor.status}</p> */}
                                    {index < quotationReq.vendors!.length - 1 && <hr />} {/* Add a separator between vendors */}
                                    <p><strong>Business Name: </strong> {"Sahil Kumar"}</p>
                                    {/* <p><strong>status: </strong> {vendor.status}</p> */}
                                </div>
                            ))}
                        </td>
                        <td className="p-2 text-center border-r align-middle">{quotationReq.procurement?.procurementName}</td>
                        <td className="p-2 text-center border-r align-middle">{quotationReq.createdBy}</td>
                        <td className="p-2 text-center border-r align-middle">{quotationReq.expiryDate?.toDateString()}</td>
                        {quotationReq.status === QuotationRequestStatus.ACTIVE ?
                        <td className="p-2 text-center align-middle">
                            <Button className='bg-custom-red p-2 text-white pi pi-eye' onClick={() => router.push(`/quotations/quotation_requests/${quotationReq.quotationRequestId}`)}></Button>
                        </td>
                        :
                        <td className="p-2 text-center align-middle">
                            <Button className='bg-custom-red p-2 text-white pi pi-pencil' onClick={() => router.push(`/quotations/quotation_requests/${quotationReq.quotationRequestId}`)}></Button>
                        </td>
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default QuotationRequestsTable
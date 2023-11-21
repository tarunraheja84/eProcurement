'use client'
import { QuotationStatus } from '@/types/enums'
import { Quotation } from '@/types/quotation'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Calendar } from 'primereact/calendar';
import axios from "axios";

type Props = {
    quotations: Quotation[]
}

const QuotationTable = (props: Props) => {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<string>(QuotationStatus.PENDING);
    const [dates, setDates] = useState<any>([new Date(), new Date()]);
    const [quotations, setQuotations] = useState<Quotation[]>(props.quotations)
    const handleFilter = async () => {
        const startDate = dates[0];
        const endDate = dates[1];
        const status = statusFilter
        const result = await axios.post("/api/quotations",{startDate, endDate, status })
        result.data.map((quot : Quotation) => {
            quot.createdAt =  new Date(quot.createdAt!)
            quot.updatedAt = new Date(quot.updatedAt!)
            quot.expiryDate = new Date(quot.expiryDate!)

        })
        const quots : Quotation[] = result.data;
        setQuotations(quots)
    }
    return (
        <>
            <div className='overflow-x-auto'>
                <div className="flex justify-between items-center p-2 border-2 mb-2 shadow-lg rounded bg-light-red">
                    <div className="flex items-center space-x-2">
                        <div className='flex flex-col items-center'>
                            <label className="block font-bold text-xs mb-1" htmlFor="planName">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none border rounded-md px-2 py-1 border-red-100 shadow-md"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="ACCEPTED">ACCEPTED</option>
                                <option value="REJECTED">REJECTED</option>
                                <option value="VOID">VOID</option>
                            </select>
                        </div>
                        <div className='flex flex-col items-center'>
                            <label className="block font-bold text-xs mb-1" htmlFor="planName">
                                Date Range
                            </label>
                            <div className="card flex justify-content-center border-1 rounded-md border-red-100 shadow-md h-[30px]">
                                <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput />
                            </div>
                        </div>
                    </div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                        onClick={handleFilter}
                    >
                        Apply
                    </button>
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className="table-auto w-full border border-black">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-center border-r">Quotation</th>
                            <th className="p-2 text-center border-r">Quotation Status</th>
                            <th className="p-2 text-center border-r">Vendor</th>
                            <th className="p-2 text-center border-r">Procurement</th>
                            <th className="p-2 text-center border-r">Expired Date</th>
                            <th className="p-2 text-center"></th>
                            <th className="p-2 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotations.map((quotation: Quotation) => (
                            <tr key={quotation.quotationId} className="border-b border-black">
                                <td className="p-2 text-center border-r align-middle">{quotation.quotationName}</td>
                                <td className="p-2 text-center border-r align-middle">{quotation.status}</td>
                                <td className="p-2  text-center border-r align-middle">{quotation.vendor?.businessName}</td>
                                <td className="p-2 text-center border-r align-middle">{quotation.procurement?.procurementName}</td>
                                <td className="p-2 text-center border-r align-middle">{quotation.expiryDate?.toDateString()}</td>
                                <td className={`bg-custom-red p-2 text-white pi pi-${quotation.status === QuotationStatus.ACCEPTED ? "eye" : "pencil"} rounded-lg m-2 `} onClick={() => router.push(`/quotations/${quotation.quotationId}`)}></td>
                                {quotation.status === QuotationStatus.ACCEPTED && <td className="p-2 align-middle">
                                    <Button className='bg-custom-red text-white pi pi-shopping-cart p-2' onClick={() => router.push(`/orders/create/${quotation.quotationId}`)}> Purchase</Button>
                                </td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default QuotationTable

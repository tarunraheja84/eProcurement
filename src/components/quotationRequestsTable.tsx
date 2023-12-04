'use client'
import { QuotationRequest } from '@/types/quotationRequest'
import { convertDateTime, prevBackButtonColors } from '@/utils/helperFrontendFunctions'
import { QuotationRequestStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import {
    subDays,
    startOfDay,
    endOfDay,
} from 'date-fns';
import DateRangePicker from './DateRangePicker'
import Loading from '@/app/loading'
import axios from 'axios'

type Props = {
    quotationRequests: any,
    noOfQuotationRequests: number,
    context : string
}

const QuotationRequestsTable = ({ quotationRequests, noOfQuotationRequests, context }: Props) => {
    const router = useRouter();
    const today = new Date();
    const [status, setStatus] = useState<string>(context==="my_quotation_requests"?"":QuotationRequestStatus.ACTIVE);
    const [startDate, setStartDate] = useState<Date | null>(startOfDay(subDays(today, 6)));
    const [endDate, setEndDate] = useState<Date | null>(endOfDay(today));
    const [Page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(Math.ceil(noOfQuotationRequests / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
    const [filteredQuotationRequests, setFilteredQuotationRequests] = useState(quotationRequests);
    const [quotationRequestsList, setQuotationRequestsList] = useState(quotationRequests);
    
    const fetchQuotationRequests = async (page: number) => {
        const pagesFetched = Math.ceil(quotationRequestsList.length / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE));
        if (page > pagesFetched) {
            try {
                setLoading(true);
                const result = await axios.post(`/api/quotations/quotation_request/read`, { page: page, startDate: startDate, endDate: endDate, status: status, q:context })
                setQuotationRequestsList((prev: QuotationRequest[]) => [...prev, ...result.data]);
                setFilteredQuotationRequests(result.data);
                setPage(page);
            }
            catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
        else {
            showLastQuotationRequests(page);
        }
    }

    const showLastQuotationRequests = async (page: number) => {
        const skip = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1);
        const take = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE);
        setFilteredQuotationRequests(quotationRequestsList.slice(skip, skip + take));
        setPage(page);
    }

    const applyFilters = async () => {
        try {
            setLoading(true);
            const [result, totalFilteredPages] = await Promise.all([axios.post(`/api/quotations/quotation_request/read`, { page: 1, startDate: startDate, endDate: endDate, status: status, q:context }),
            axios.post(`/api/quotations/quotation_request/read`, { startDate: startDate, endDate: endDate, status: status, count:true, q:context })
            ]);
            setFilteredQuotationRequests(result.data);
            setTotalPages(Math.ceil(totalFilteredPages.data.count / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
            setPage(1);
            setQuotationRequestsList(result.data);
        }
        catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        prevBackButtonColors(Page, totalPages);
    }, [filteredQuotationRequests])

    return (
        <>
            {/* filters */}
            <div className="flex flex-col md:flex-row justify-between p-4 md:py-2 my-4 rounded-md bg-custom-gray-3 space-y-4 md:space-y-0">

                <div className={`flex flex-col md:flex-row justify-center md:items-center space-y-4 md:space-y-0 md:space-x-4`}>
                    <div>
                        <label className="text-sm font-medium text-custom-gray-5">Start Date: </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => {
                                setStartDate(date as Date);
                                const dateRange = document.getElementById("dateRange");
                                if (dateRange) {
                                    const customOption = dateRange.querySelector('option[value="custom"]');
                                    if (customOption) {
                                        (customOption as any).selected = true;
                                    }
                                }
                            }}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="MMMM d, yyyy"
                            className="w-full px-2 border rounded-md cursor-pointer outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-custom-gray-5">End Date: </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => {
                                setEndDate(date as Date);
                                const dateRange = document.getElementById("dateRange");
                                if (dateRange) {
                                    const customOption = dateRange.querySelector('option[value="custom"]');
                                    if (customOption) {
                                        (customOption as any).selected = true;
                                    }
                                }
                            }}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="MMMM d, yyyy"
                            className="w-full px-2 border rounded-md cursor-pointer outline-none"
                        />
                    </div>

                </div>

                <div className="flex flex-col md:flex-row my-auto space-y-4 md:space-y-0">
                    <div className="my-auto">
                        <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Date Range: </label>
                        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
                    </div>

                    <div className="my-auto xl:pt-2">
                        <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Status: </label>
                        <select
                            defaultValue={context==="my_quotation_requests"?"":QuotationRequestStatus.ACTIVE}
                            className="md:ml-2 focus:outline-none cursor-pointer rounded-md"
                            onChange={(e) => {
                                setStatus(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value={QuotationRequestStatus.ACTIVE}>ACTIVE</option>
                            <option value={QuotationRequestStatus.DRAFT}>DRAFT</option>
                            <option value={QuotationRequestStatus.EXPIRED}>EXPIRED</option>
                            <option value={QuotationRequestStatus.VOID}>VOID</option>
                        </select>
                    </div>

                    <div className="my-auto flex items-center justify-center ">
                        <div className="h-fit md:ml-4 p-2 mt-2 md:mt-0 bg-custom-red hover:bg-hover-red text-white rounded-md outline-none cursor-pointer"
                            onClick={applyFilters}>
                            Apply&nbsp;Filters
                        </div>
                    </div>

                </div>
            </div>

            {loading ? < Loading /> : <>
                {
                    filteredQuotationRequests.length ?
                        <div className='overflow-x-auto'>
                            <table className="table-auto w-full border border-black">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2 text-center border-r">Quotation Request</th>
                                        <th className="p-2 text-center border-r">Created At</th>
                                        <th className="p-2 text-center border-r">Quotation Req. Status</th>
                                        <th className="p-2 text-center border-r">Vendors</th>
                                        <th className="p-2 text-center border-r">Procurement</th>
                                        <th className="p-2 text-center border-r">Created By</th>
                                        <th className="p-2 text-center border-r">Expired Date</th>
                                        <th className="p-2 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredQuotationRequests.map((quotationReq: QuotationRequest) => (
                                        <tr key={quotationReq.quotationRequestId} className="border-b border-black">
                                            <td className="p-2 text-center border-r align-middle">{quotationReq.quotationRequestName}</td>
                                            <td className="p-2 text-center border-r align-middle">{convertDateTime(quotationReq.createdAt!.toString())}</td>
                                            <td className="p-2 text-center border-r align-middle">{quotationReq.status === QuotationRequestStatus.ACTIVE ? "SENT" : quotationReq.status}</td>
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
                                            <td className="p-2 text-center border-r align-middle">{convertDateTime(quotationReq.expiryDate!.toString())}</td>
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

                            <div className="flex flex-row-reverse">Page {Page}/{totalPages}</div>
                            <div className="flex justify-end gap-2 mt-2">
                                <button id="prevButton" className="bg-custom-red text-white px-3 py-2 rounded-md" onClick={() => {
                                    if (Page > 1)
                                        showLastQuotationRequests(Page - 1);
                                }}>← Prev</button>
                                <button id="nextButton" className="bg-custom-red text-white px-3 py-2 rounded-md" onClick={() => {
                                    if (Page < totalPages)
                                        fetchQuotationRequests(Page + 1);
                                }}>Next →</button>
                            </div>

                        </div>
                        : <div className='text-center'>No Quotation Requests to display</div>
                }
            </>}
        </>
    )
}

export default QuotationRequestsTable

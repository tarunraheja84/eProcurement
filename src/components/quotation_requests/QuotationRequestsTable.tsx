'use client'
import { convertDateTime, GetPermissions, prevBackButtonColors, quotationRequestStatusColor } from '@/utils/helperFrontendFunctions'
import { QuotationRequestStatus, Vendor } from '@prisma/client'
import { useRouter } from 'next/navigation'
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import DateRangePicker from '@/components/common_components/DateRangePicker'
import Loading from '@/app/loading'
import axios from 'axios'
import { QuotationRequestsType, UserType } from '@/types/enums'
import Image from 'next/image'
import { useSession } from 'next-auth/react';
import AccessDenied from '@/app/access_denied/page';

type Props = {
    quotationRequests: any,
    noOfQuotationRequests: number,
    quotationRequestType: QuotationRequestsType
}

const QuotationRequestsTable = ({ quotationRequests, noOfQuotationRequests, quotationRequestType }: Props) => {
    const router = useRouter();
    const session: UserSession | undefined = useSession().data?.user;
    const isVendorLogin = session?.userType === UserType.VENDOR_USER ? true : false
    const [status, setStatus] = useState<string>(quotationRequestType === QuotationRequestsType.MY_QUOTATION_REQUESTS ? "" : QuotationRequestStatus.ACTIVE);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
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
                const result = await axios.post(`/api/quotation_requests/read`, { page: page, startDate: startDate, endDate: endDate, status: status, q: quotationRequestType })
                setQuotationRequestsList((prev:any) => [...prev, ...result.data]);
                setFilteredQuotationRequests(result.data);
                setPage(page);
            }
            catch (error) {
                console.log('error  :>> ', error);
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
            const [result, totalFilteredPages] = await Promise.all([axios.post(`/api/quotation_requests/read`, { page: 1, startDate: startDate, endDate: endDate, status: status, q: quotationRequestType }),
            axios.post(`/api/quotation_requests/read`, { startDate: startDate, endDate: endDate, status: status, count: true, q: quotationRequestType })
            ]);
            setFilteredQuotationRequests(result.data);
            setTotalPages(Math.ceil(totalFilteredPages.data.count / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
            setPage(1);
            setQuotationRequestsList(result.data);
        }
        catch (error) {
            console.log('error  :>> ', error);
        }
        setLoading(false);
    }

    useEffect(() => {
        prevBackButtonColors(Page, totalPages);
    }, [filteredQuotationRequests])

    return (
        <>
        {GetPermissions("quotationRequestPermissions","view") ? <>
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
                            defaultValue={quotationRequestType === QuotationRequestsType.MY_QUOTATION_REQUESTS ? "" : QuotationRequestStatus.ACTIVE}
                            className="md:ml-2 focus:outline-none cursor-pointer rounded-md bg-white px-2"
                            onChange={(e) => {
                                setStatus(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value={QuotationRequestStatus.ACTIVE}>{isVendorLogin ? "RECEIVED" : "SENT"}</option>
                            {quotationRequestType === QuotationRequestsType.MY_QUOTATION_REQUESTS && <option value={QuotationRequestStatus.DRAFT}>DRAFT</option>}
                            <option value={QuotationRequestStatus.EXPIRED}>EXPIRED</option>
                            <option value={QuotationRequestStatus.VOID}>VOID</option>
                        </select>
                    </div>

                    <div className="my-auto flex items-center justify-center ">
                        <div className="h-fit md:ml-4 p-2 mt-2 md:mt-0 bg-custom-theme hover:bg-hover-theme text-custom-buttonText rounded-md outline-none cursor-pointer"
                            onClick={applyFilters}>
                            Apply&nbsp;Filters
                        </div>
                    </div>

                </div>
            </div>
            
            {!isVendorLogin && <div className="flex justify-between items-center pb-4">
                <span>{quotationRequestType === QuotationRequestsType.ALL_QUOTATION_REQUESTS ? "All Quotation Requests" : "My Quotation Requests"}</span>
                {GetPermissions("quotationRequestPermissions","create") &&<button className="bg-custom-theme hover:bg-hover-theme px-5 py-3 text-custom-buttonText hidden md:inline-block rounded-md" onClick={() => router.push("/quotation_requests/create")}>Create New</button>}
                {GetPermissions("quotationRequestPermissions","create") && <Image src="/red-plus.png" className="md:hidden" height={20} width={20} alt="Add" onClick={() => router.push("/quotation_requests/create")} />}
            </div>}

            {isVendorLogin && <div className="flex justify-between items-center pb-4">
                <span>All Quotation Requests</span>
            </div>}

            {loading ? < Loading /> : <>
                {
                            filteredQuotationRequests.length ?
                                <div className='overflow-x-auto'>
                                    <table className="table-auto w-full border border-black">
                                        <thead>
                                            <tr className="bg-custom-gray-2">
                                                <th className="p-2 text-center border-r">S.No</th>
                                                <th className="p-2 text-center border-r">Quotation Request</th>
                                                {isVendorLogin? <th className="p-2 text-center border-r">Received At</th>:
                                                <th className="p-2 text-center border-r">Created At</th>}
                                                <th className="p-2 text-center border-r">Quotation Req. Status</th>
                                                {!isVendorLogin && <th className="p-2 text-center border-r">Vendors</th>}
                                                {!isVendorLogin && <th className="p-2 text-center border-r">Procurement</th>}
                                                {!isVendorLogin && <th className="p-2 text-center border-r">Created By</th>}
                                                <th className="p-2 text-center border-r">Expiry Date</th>
                                                <th className="p-2 text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredQuotationRequests.map((quotationReq: any, index:number) => (
                                                <tr key={quotationReq.quotationRequestId} className="border-b border-black">
                                                    <td className="p-2 text-center border-r align-middle">{Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (Page - 1) + index + 1}</td>
                                                    <td className="p-2 text-center border-r align-middle">{quotationReq.quotationRequestName}</td>
                                                    <td className="p-2 text-center border-r align-middle">{convertDateTime(quotationReq.createdAt!.toString())}</td>
                                                    <td className="p-2 text-center border-r align-middle"><span className={quotationRequestStatusColor(quotationReq.status)}>{quotationReq.status === QuotationRequestStatus.ACTIVE ? `${!isVendorLogin? "SENT": "RECEIVED"}` : quotationReq.status}</span></td>
                                                   {!isVendorLogin && <td className="p-2 text-center border-r align-middle w-80">
                                                        {quotationReq.vendors?.map((vendor:Vendor, index:number) => (
                                                            <div key={vendor.vendorId}>
                                                                {vendor.businessName}
                                                                {/* <p><strong>Business Name: </strong> {vendor.businessName}</p> */}
                                                                {/* <p><strong>status: </strong> {vendor.status}</p> */}
                                                                {/* index < quotationReq.vendors!.length - 1 && <hr /> Add a separator between vendors */}
                                                                {/* <p><strong>Business Name: </strong> {"Ritesh Kumar"}</p> */}
                                                                {/* <p><strong>status: </strong> {vendor.status}</p> */}
                                                            </div>
                                                        ))}
                                                    </td>}
                                                    {!isVendorLogin && <td className="p-2 text-center border-r align-middle">{quotationReq.procurement?.procurementName}</td>}
                                                    {!isVendorLogin && <td className="p-2 text-center border-r align-middle">{quotationReq.createdBy}</td>}
                                                    <td className="p-2 text-center border-r align-middle">{convertDateTime(quotationReq.expiryDate!.toString())}</td>
                                                    {isVendorLogin ?
                                                    <td className="p-2 text-center align-middle">
                                                        <button className='bg-custom-theme hover:bg-hover-theme px-5 py-2 text-custom-buttonText rounded-md' onClick={() => router.push(`/vendor//quotation_requests/${quotationReq.quotationRequestId}/view`)}>View</button>
                                                    </td>:
                                                    <td className="p-2 text-center align-middle">
                                                        <button className='bg-custom-theme hover:bg-hover-theme px-5 py-2 text-custom-buttonText rounded-md' onClick={() => router.push(`/quotation_requests/${quotationReq.quotationRequestId}/view`)}>View</button>
                                                    </td>
                                                    }
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="flex flex-row-reverse">Page {Page}/{totalPages}</div>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button id="prevButton" className="bg-custom-theme text-custom-buttonText px-3 py-2 rounded-md" onClick={() => {
                                            if (Page > 1)
                                                showLastQuotationRequests(Page - 1);
                                        }}>← Prev</button>
                                        <button id="nextButton" className="bg-custom-theme text-custom-buttonText px-3 py-2 rounded-md" onClick={() => {
                                            if (Page < totalPages)
                                                fetchQuotationRequests(Page + 1);
                                        }}>Next →</button>
                                    </div>

                                </div>
                                : <div className='text-center'>No Quotation Requests to display</div>
                }
            </>}

            </>:<AccessDenied />}
        </>
    )
}

export default QuotationRequestsTable

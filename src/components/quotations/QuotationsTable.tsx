'use client'
import { Quotation } from '@/types/quotation'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import axios from "axios";
import { QuotationStatus } from '@prisma/client'
import { convertDateTime, getPermissions, prevBackButtonColors } from '@/utils/helperFrontendFunctions'
import {
    subDays,
    startOfDay,
    endOfDay,
} from 'date-fns';
import Loading from '@/app/loading'
import DateRangePicker from '@/components/common_components/DateRangePicker'
import { useSession } from 'next-auth/react';
import { UserType } from '@/types/enums';
import AccessDenied from '@/app/access_denied/page';

type Props = {
    quotations: any,
    noOfQuotations: number
}

const QuotationTable = ({ quotations, noOfQuotations }: Props) => {
    const router = useRouter();
    const session: UserSession | undefined = useSession().data?.user;
    const isVendorLogin = session?.userType === UserType.VENDOR_USER ? true : false
    const today = new Date();
    const [status, setStatus] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(startOfDay(subDays(today, 6)));
    const [endDate, setEndDate] = useState<Date | null>(endOfDay(today));
    const [Page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(Math.ceil(noOfQuotations / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
    const [filteredQuotations, setFilteredQuotations] = useState(quotations);
    const [quotationsList, setQuotationsList] = useState(quotations);

    const fetchQuotations = async (page: number) => {
        const pagesFetched = Math.ceil(quotationsList.length / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE));
        if (page > pagesFetched) {
            try {
                setLoading(true);
                const result = await axios.post(`/api/quotations/read`, { page: page, startDate: startDate, endDate: endDate, status: status })
                setQuotationsList((prev: Quotation[]) => [...prev, ...result.data]);
                setFilteredQuotations(result.data);
                setPage(page);
            }
            catch (error) {
                console.log('error  :>> ', error);
            }
            setLoading(false);
        }
        else {
            showLastQuotations(page);
        }
    }

    const showLastQuotations = async (page: number) => {
        const skip = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1);
        const take = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE);
        setFilteredQuotations(quotationsList.slice(skip, skip + take));
        setPage(page);
    }

    const applyFilters = async () => {
        try {
            setLoading(true);
            const [result, totalFilteredPages] = await Promise.all([axios.post(`/api/quotations/read`, { page: 1, startDate: startDate, endDate: endDate, status: status }),
            axios.post(`/api/quotations/read`, { startDate: startDate, endDate: endDate, status: status, count: true })
            ]);
            setFilteredQuotations(result.data);
            setTotalPages(Math.ceil(totalFilteredPages.data.count / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
            setPage(1);
            setQuotationsList(result.data);
        }
        catch (error) {
            console.log('error  :>> ', error);
        }
        setLoading(false);
    }

    useEffect(() => {
        prevBackButtonColors(Page, totalPages);
    }, [filteredQuotations])

    return (
        <>
        {getPermissions("quotationPermissions","view") ? <>
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
                            className="md:ml-2 focus:outline-none cursor-pointer rounded-md"
                            onChange={(e) => {
                                setStatus(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value={QuotationStatus.ACCEPTED}>ACCEPTED</option>
                            <option value={QuotationStatus.EXPIRED}>EXPIRED</option>
                            <option value={QuotationStatus.PENDING}>PENDING</option>
                            <option value={QuotationStatus.REJECTED}>REJECTED</option>
                        </select>
                    </div>

                    <div className="my-auto flex items-center justify-center ">
                        <div className="h-fit md:ml-4 p-2 mt-2 md:mt-0 bg-custom-theme hover:bg-hover-theme text-white rounded-md outline-none cursor-pointer"
                            onClick={applyFilters}>
                            Apply&nbsp;Filters
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex justify-between items-center pb-4">
                <span>All Quotations</span>
            </div>

            {loading ? < Loading /> : <>
                {
                    filteredQuotations.length ?
            <div className='overflow-x-auto'>
                <table className="table-auto w-full border border-black">
                    <thead>
                        <tr className="bg-custom-gray-2">
                            <th className="p-2 text-center border-r">S.No</th>
                            <th className="p-2 text-center border-r">Quotation</th>
                            <th className="p-2 text-center border-r">Created At</th>
                            <th className="p-2 text-center border-r">Quotation Status</th>
                            {!isVendorLogin && <th className="p-2 text-center border-r">Vendor</th>}
                            {!isVendorLogin && <th className="p-2 text-center border-r">Procurement</th>}
                            <th className="p-2 text-center border-r">Expiry Date</th>
                            <th className="p-2 text-center"></th>
                            <th className="p-2 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQuotations.map((quotation: Quotation, index:number) => (
                            <tr key={quotation.quotationId} className="border-b border-black">
                                <td className="p-2 text-center border-r align-middle">{Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (Page - 1) + index + 1}</td>
                                <td className="p-2 text-center border-r align-middle">{quotation.quotationName}</td>
                                <td className="p-2 text-center border-r align-middle">{convertDateTime(quotation.createdAt!.toString())}</td>
                                <td className="p-2 text-center border-r align-middle">{quotation.status}</td>
                                {!isVendorLogin && <td className="p-2  text-center border-r align-middle">{quotation.vendor?.businessName}</td>}
                                {!isVendorLogin && <td className="p-2 text-center border-r align-middle">{quotation.procurement?.procurementName}</td>}
                                <td className="p-2 text-center border-r align-middle">{convertDateTime(quotation.expiryDate!.toString())}</td>
                                <td className="p-2 text-center align-middle">
                                {!isVendorLogin ? <button className={'bg-custom-theme hover:bg-hover-theme px-5 py-2 text-white rounded-md'} onClick={() => router.push(`/quotations/${quotation.quotationId}/view`)}>View</button>:
                                <button className={'bg-custom-theme hover:bg-hover-theme px-5 py-2 text-white rounded-md'} onClick={() => router.push(`/vendor/quotations/${quotation.quotationId}/view`)}>View</button>
                                }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex flex-row-reverse">Page {Page}/{totalPages}</div>
                            <div className="flex justify-end gap-2 mt-2">
                                <button id="prevButton" className="bg-custom-theme text-white px-3 py-2 rounded-md" onClick={() => {
                                    if (Page > 1) showLastQuotations(Page - 1);
                                }}>← Prev</button>
                                <button id="nextButton" className="bg-custom-theme text-white px-3 py-2 rounded-md" onClick={() => {
                                    if (Page < totalPages) fetchQuotations(Page + 1);
                                }}>Next →</button>
                            </div>

                        </div>
                        : <div className='text-center'>No Quotation to display in this Date Range</div>
                }
            </>}
            </>:<AccessDenied />}
        </>
    )
}

export default QuotationTable

"use client"
import { Procurement, ProcurementStatus } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { convertDateTime, GetPermissions, prevBackButtonColors, procurementStatusColor } from '@/utils/helperFrontendFunctions';
import Loading from '@/app/loading';
import { ProcurementsType } from '@/types/enums';
import AccessDenied from '@/app/access_denied/page';
import PlusSignIcon from '@/svg/PlusSignIcon';

type Props = {
    procurements: Procurement[],
    numberOfProcurements: number,
    procurementType: ProcurementsType
}

const ProcurementsTable = ({ procurements, numberOfProcurements, procurementType }: Props) => {
    const [totalPages, setTotalPages] = useState(Math.ceil(numberOfProcurements / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
    const [filteredProcurements, setFilteredProcurements] = useState(procurements);
    const [procurementsList, setProcurementsList] = useState(procurements);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [Page, setPage] = useState(1);
    const router = useRouter();

    const fetchProcurements = async (page: number) => {
        const pagesFetched = Math.ceil(procurementsList.length / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE));
        if (page > pagesFetched) {
            try {
                setLoading(true);
                const result: { data: Procurement[] } = await axios.post(`/api/getProcurements`,{page, status, q:procurementType});
                setProcurementsList((prev) => [...prev, ...result.data]);
                setFilteredProcurements(result.data);
                setPage(page);
            }
            catch (error) {
                console.log('error  :>> ', error);
            }
            setLoading(false);
        }
        else {
            showLastProcurements(page);
        }
    }

    const showLastProcurements = async (page: number) => {
        const skip = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1);
        const take = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE);
        setFilteredProcurements(procurementsList.slice(skip, skip + take));
        setPage(page);
    }

    const applyFilters = async () => {
        try {
            setLoading(true);
            const [result, totalFilteredPages] = await Promise.all([axios.post(`/api/getProcurements`,{page:1, status, q:procurementType}),
            axios.post(`/api/procurements`, {status, q:procurementType, count:true})
            ]);
            setFilteredProcurements(result.data);
            setTotalPages(Math.ceil(totalFilteredPages.data.count / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
            setPage(1);
            setProcurementsList(result.data);
        }
        catch (error) {
            console.log('error  :>> ', error);
        }
        setLoading(false);
    }

    useEffect(() => {
        prevBackButtonColors(Page, totalPages);
    }, [filteredProcurements])

    return (
        <>
            {GetPermissions("procurementPermissions","view") ? <>
                {/* filters */}
                <div className="flex flex-col md:flex-row justify-between p-4 md:py-2 my-4 rounded-md bg-custom-gray-3 space-y-4 md:space-y-0">
                    <div></div>
                    <div className={`flex flex-col md:flex-row justify-center md:items-center space-y-4 md:space-y-0 md:space-x-4`}>
                        <div className="my-auto xl:pt-2">
                            <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Status: </label>
                            <select
                                defaultValue={status}
                                className="md:ml-2 focus:outline-none cursor-pointer rounded-md bg-white px-2"
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                }}
                            >
                                <option value="">All</option>
                                <option value={ProcurementStatus.ACTIVE}>ACTIVE</option>
                                <option value={ProcurementStatus.INACTIVE}>INACTIVE</option>
                                <option value={ProcurementStatus.AWAITING_APPROVAL}>AWAITING_APPROVAL</option>
                                {procurementType === ProcurementsType.MY_PROCUREMENTS && <option value={ProcurementStatus.DRAFT}>DRAFT</option>}
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

                <div className="flex justify-between items-center pb-4">
                    <span>{procurementType === ProcurementsType.ALL_PROCUREMENTS ? "All Procurements" : "My Plans"}</span>
                    {GetPermissions("procurementPermissions","create") &&
                    <>
                    <button className="bg-custom-theme hover:bg-hover-theme px-5 py-3 text-custom-buttonText hidden md:inline-block rounded-md" onClick={() => router.push("/procurements/create")}>Create New Procurement</button>
                    <div className="md:hidden" onClick={() => router.push("/procurements/create")}><PlusSignIcon /></div>
                    </> }
                </div>
                {loading ? < Loading /> : <>
                    {
                        filteredProcurements.length ?
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full border border-black">
                                        <thead>
                                            <tr className="bg-custom-gray-2">
                                                <th className="p-2 text-center border-r">S.No</th>
                                                <th className="p-2 text-center border-r">Procurement Name</th>
                                                <th className="p-2 text-center border-r">Created By</th>
                                                <th className="p-2 text-center border-r">Updated At</th>
                                                <th className="p-2 text-center border-r">Status</th>
                                                <th className="p-2 text-center border-r">Confirmed By</th>
                                                <th className="p-2 text-center border-r">Requested To</th>
                                                <th className="p-2 text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProcurements.map((procurement: Procurement, index: number) => (
                                                <tr key={index} className="border-b border-black">
                                                    <td className="p-2 text-center border-r align-middle">{Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (Page - 1) + index + 1}</td>
                                                    <td className="p-2 text-center border-r align-middle">{procurement.procurementName}</td>
                                                    <td className="p-2 text-center border-r align-middle">{procurement.createdBy}</td>
                                                    <td className="p-2 text-center border-r align-middle">{convertDateTime(procurement.updatedAt.toString())}
                                                    </td>
                                                    <td className={`p-2 text-center border-r align-middle ${procurementStatusColor(procurement.status)}`}>{procurement.status}</td>
                                                    <td className="p-2 text-center border-r align-middle">{procurement.confirmedBy ? procurement.confirmedBy : "-"}</td>
                                                    <td className="p-2 text-center border-r align-middle">{procurement.requestedTo ? procurement.requestedTo : "-"}</td>
                                                    <td className={`p-2 text-center align-middle`}>
                                                        <button className="bg-custom-theme hover:bg-hover-theme px-5 py-2 text-custom-buttonText rounded-md" onClick={() => { router.push(`/procurements/${procurement.procurementId}/view`) }}>View</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="flex flex-row-reverse">Page {Page}/{totalPages}</div>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button id="prevButton" className="bg-custom-theme text-custom-buttonText px-3 py-2 rounded-md" onClick={() => {
                                            if (Page > 1)
                                                showLastProcurements(Page - 1);
                                        }}>← Prev</button>
                                        <button id="nextButton" className="bg-custom-theme text-custom-buttonText px-3 py-2 rounded-md" onClick={() => {
                                            if (Page < totalPages)
                                                fetchProcurements(Page + 1);
                                        }}>Next →</button>
                                    </div>
                                </div>
                            </div>
                            : <div className='text-center'>No Procurements to display</div>
                    }
                </>}
            </>:<AccessDenied />}
        </>
    )
}

export default ProcurementsTable

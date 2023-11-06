'use client'
import { Procurement } from '@/types/procurement'
import { ProcurementStatus } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'

const page = (context:any) => {
    const router = useRouter();
    const [procurements, setProcurements]= useState([]);
    const { data: session } = useSession();
    let userMail:any;
    if (session && session.user)
        userMail=session.user.email

    useEffect(()=>{
        (async ()=>{
            const result=await axios.get("/api/fetch_from_db/fetch_dbProcurements")
            if(context.searchParams.q==="all_procurements")
                result.data=result.data.filter((data:any)=>data.status!==ProcurementStatus.DRAFT)
            else
                result.data=result.data.filter((data:any)=>data.status===ProcurementStatus.DRAFT && data.createdBy===userMail)
            setProcurements(result.data)
        })();
    },[context])
  return (
    <>
    <div className="flex justify-between items-center pb-4">
    <span className="">All Procurements</span>
    <Button className="bg-custom-red hover:bg-hover-red px-5 py-3 text-white hidden md:inline-block oultine-none" onClick={() => router.push("/procurements/create")}>Create New Procurement</Button>
    <Image src="/red-plus.png" className="md:hidden" height={20} width={20} alt="Add" onClick={() => router.push("/procurements/create")}/>
    </div>
    <div className="overflow-x-auto">
        <table className="table-auto w-full border border-black">
            <thead>
                <tr className="bg-gray-200">
                    <th className="p-2 text-center border-r">Procurement Name</th>
                    <th className="p-2 text-center border-r">Created By</th>
                    <th className="p-2 text-center border-r">Status</th>
                    <th className="p-2 text-center border-r">Confirmed By</th>
                    <th className="p-2 text-center"></th>
                    <th className="p-2 text-center"></th>
                </tr>
            </thead>
            <tbody>
            {procurements.map((procurement: Procurement, index) => (
                    <tr key={index} className="border-b border-black">
                        <td className="p-2 text-center border-r align-middle">{procurement.procurementName}</td>
                        <td className="p-2 text-center border-r align-middle">{procurement.createdBy}</td>
                        <td className="p-2 text-center border-r align-middle">{procurement.status}</td>
                        <td className="p-2 text-center border-r align-middle">{procurement.confirmedBy?procurement.confirmedBy:"-"}</td>
                        <td className="p-2 text-center border-r align-middle">
                            <Button className='bg-custom-red hover:bg-hover-red px-5 py-2 text-white outline-none' onClick={() => {router.push(`/procurements/${procurement.procurementId}`)}}>View</Button>
                        </td>
                        <td className="p-2 text-center align-middle">
                            <Button className='bg-custom-red hover:bg-hover-red px-5 py-2 text-white outline-none' onClick={() => {router.push("/quotations/create")}}>Create Quote Request</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    </>
  )
}

export default page

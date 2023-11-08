"use client"
import { ProcurementStatus } from '@/types/enums';
import { Procurement } from '@/types/procurement';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

const ProcurementsTable = ({procurements, context}:any) => {
    //data coming from db has to be defined any (vendor coming from db is defined any by Ritesh also)

    const router = useRouter();
    const { data: session } = useSession();
    let userMail:any, userName:any;
    if (session && session.user){
        userMail=session.user.email
        userName=session.user.name
    }

    if(context.searchParams.q==="all_procurements")
    procurements=procurements.filter((procurement:any)=>procurement.status!==ProcurementStatus.DRAFT)
    else
    procurements=procurements.filter((procurement:any)=>procurement.createdBy===userMail || procurement.updatedBy===userMail || procurement.confirmedBy===userName || procurement.requestedTo===userName)
  return (
    <>
    <div className="flex justify-between items-center pb-4">
    <span>{context.searchParams.q==="all_procurements"?"All Procurements":"My Plans"}</span>
    <button className="bg-custom-red hover:bg-hover-red px-5 py-3 text-white hidden md:inline-block rounded-md" onClick={() => router.push("/procurements/create")}>Create New Procurement</button>
    <Image src="/red-plus.png" className="md:hidden" height={20} width={20} alt="Add" onClick={() => router.push("/procurements/create")}/>
    </div>
    <div className="overflow-x-auto">
        <table className="table-auto w-full border border-black">
            <thead>
                <tr className="bg-gray-200">
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
            {procurements.map((procurement: Procurement, index:number) => (
                    <tr key={index} className="border-b border-black">
                        <td className="p-2 text-center border-r align-middle">{procurement.procurementName}</td>
                        <td className="p-2 text-center border-r align-middle">{procurement.createdBy}</td>
                        <td className="p-2 text-center border-r align-middle">{procurement.updatedAt.toString().slice(0,-31)}
                        </td>
                        <td className="p-2 text-center border-r align-middle">{procurement.status}</td>
                        <td className="p-2 text-center border-r align-middle">{procurement.confirmedBy?procurement.confirmedBy:"-"}</td>
                        <td className="p-2 text-center border-r align-middle">{procurement.requestedTo?procurement.requestedTo:"-"}</td>
                        <td className={`p-2 text-center align-middle`}>
                            <button className='bg-custom-red hover:bg-hover-red px-5 py-2 text-white rounded-md' onClick={() => {router.push(`/procurements/${procurement.procurementId}`)}}>View</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    </>
  )
}

export default ProcurementsTable
'use client'
import { getPermissions } from '@/utils/helperFrontendFunctions';
import { useRouter } from 'next/navigation'
import React from 'react'
interface Props {
    heading : string;
    buttonText : string;
    route : string;
}
const TableHeader = (props: Props) => {
    const router = useRouter();
    return (
        <div className="flex justify-between items-center pb-4">
            <span>{props.heading}</span>
            {getPermissions("vendorPermissions","create") && <button className="bg-custom-theme hover:bg-hover-theme px-5 py-3 text-white hidden md:inline-block rounded-md" onClick={() => router.push(props.route)}>{props.buttonText}</button>}
        </div>
    )
}
export default TableHeader
'use client'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
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
            <button className="bg-custom-red hover:bg-hover-red px-5 py-3 text-white hidden md:inline-block rounded-md" onClick={() => router.push(props.route)}>{props.buttonText}</button>
        </div>
    )
}
export default TableHeader
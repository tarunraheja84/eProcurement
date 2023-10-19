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
            <Button className="bg-custom-red px-5 py-3 text-white" onClick={() => router.push(props.route)}>{props.buttonText}</Button>
        </div>
    )
}
export default TableHeader
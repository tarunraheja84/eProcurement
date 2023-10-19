'use client'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import React from 'react'

const VendorsPageHeader = () => {
    const router = useRouter();
    return (
        <div className="flex justify-between items-center pb-4">
            <span>Vendors List</span>
            <Button className="bg-custom-red px-5 py-3 text-white" onClick={() => router.push('/vendors/create')}>Create Vendor</Button>
        </div>
    )
}

export default VendorsPageHeader
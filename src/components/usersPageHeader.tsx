'use client'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import React from 'react'
interface Props {
    vendorId : string;
}
const UsersPageHeader = (props: Props) => {
    const router = useRouter();
    return (
        <div className="flex justify-between items-center pb-4">
            <span>Users List</span>
            <Button className="bg-custom-red px-5 py-3 text-white" onClick={() => router.push(`/vendors/${props.vendorId}/manage_users/create`)}>Create User</Button>
        </div>
    )
}

export default UsersPageHeader
import React from 'react'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers';
import UsersList from '@/components/users/UsersList';

const Page = async () => {
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value
    const [users, numberOfUsers]: any = await Promise.all([prisma.vendorUser.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
        where: {
            vendorId: vendorId
        }
    }),
    prisma.vendorUser.count({
        where: {
            vendorId: vendorId
        }
    })]);
    return (
            <UsersList users={users} vendorId={vendorId} numberOfUsers={numberOfUsers} isForVendorUsers={true}/>
    )
}

export default Page

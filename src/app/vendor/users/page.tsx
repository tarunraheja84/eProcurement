import React from 'react'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers';
import UsersList from '@/components/users/UsersList';
import AccessDenied from '@/app/access_denied/page';
import { getUserSessionData } from '@/utils/utils';
import { UserRole } from '@prisma/client';

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
    const sessionData = await getUserSessionData()
    return (
        <>
            {sessionData?.role === UserRole.MANAGER ? <UsersList users={users} vendorId={vendorId} numberOfUsers={numberOfUsers} />: <AccessDenied />}
        </>
    )
}

export default Page

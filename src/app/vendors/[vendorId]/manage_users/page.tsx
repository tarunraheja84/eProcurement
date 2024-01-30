import React from 'react'
import prisma from '@/lib/prisma'
import UsersList from '@/components/users/UsersList';

const Page = async (context: any) => {
  const vendorId = context.params.vendorId;
  const [users , numberOfUsers] : any= await Promise.all([prisma.vendorUser.findMany({
    orderBy:{
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
    <div>
      <UsersList users={users} vendorId={vendorId} numberOfUsers={numberOfUsers}/>
    </div>
  )
}

export default Page

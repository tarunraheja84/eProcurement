import React from 'react'
import UsersList from '../../../../components/UsersList'
import prisma from '@/lib/prisma'

const Page = async (context: any) => {
  const vendorId = context.params.vendorId;
  const [users, numberOfUsers] = await Promise.all([prisma.vendorUser.findMany({
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
      <UsersList users={users} vendorId={vendorId} isForVendorUsers={true} numberOfUsers={numberOfUsers}/>
    </div>
  )
}

export default Page

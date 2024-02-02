import React from 'react'
import UsersList from '@/components/users/UsersList'
import prisma from '@/lib/prisma'

const page = async () => {
  const [users, numberOfUsers] = await Promise.all([prisma.internalUser.findMany({
    orderBy:{
      updatedAt: 'desc'
    },
    take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
  }),
  prisma.internalUser.count()]);

  return (
    <UsersList users={users} numberOfUsers={numberOfUsers} isForVendorUsers={false}/>
  )
}

export default page

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
    <div>
      <UsersList users={users} isForInternalUsers={true} numberOfUsers={numberOfUsers} />
    </div>
  )
}

export default page

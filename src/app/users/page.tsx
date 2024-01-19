import React from 'react'
import UsersList from '@/components/users/UsersList'
import prisma from '@/lib/prisma'
import { UserRole } from '@prisma/client';
import { getUserSessionData } from '@/utils/utils';
import AccessDenied from '../access_denied/page';

const page = async () => {
  const [users, numberOfUsers] = await Promise.all([prisma.internalUser.findMany({
    orderBy:{
      updatedAt: 'desc'
    },
    take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
  }),
  prisma.internalUser.count()]);

  const sessionData = await getUserSessionData()
  return (
    <>
      {sessionData?.role===UserRole.MANAGER ? <UsersList users={users} numberOfUsers={numberOfUsers} />: <AccessDenied />}
    </>
  )
}

export default page

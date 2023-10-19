import React from 'react'
import UsersList from './usersList'
import prisma from '@/lib/prisma'

const Page = async (context: any) => {
  const vendorId = context.params.vendorId;
  const users = await prisma.user.findMany({
    where: {
      vendorId: vendorId
    }
  })
  return (
    <div>
      <UsersList users={users}/>
    </div>
  )
}

export default Page
import React from 'react'
import UsersList from './usersList'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client';
import UsersPageHeader from '@/components/usersPageHeader';

const Page = async (context: any) => {
  const vendorId = context.params.vendorId;
  const users: User[] = await prisma.user.findMany({
    where: {
      vendorId: vendorId
    }
  })
  return (
    <div>
      <UsersPageHeader vendorId={vendorId}/>
      <UsersList users={users} vendorId={vendorId}/>
    </div>
  )
}

export default Page
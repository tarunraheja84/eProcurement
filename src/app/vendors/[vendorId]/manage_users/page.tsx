import React from 'react'
import UsersList from './usersList'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client';
import TableHeader from '@/components/tableHeader';

const Page = async (context: any) => {
  const vendorId = context.params.vendorId;
  const users: User[] = await prisma.user.findMany({
    where: {
      vendorId: vendorId
    }
  })
  return (
    <div>
      <TableHeader buttonText='Create User' heading='Users List' route={`/vendors/${vendorId}/manage_users/create`} />
      <UsersList users={users} vendorId={vendorId} />
    </div>
  )
}

export default Page
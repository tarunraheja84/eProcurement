import TableHeader from '@/components/tableHeader'
import React from 'react'
import UsersList from '@/components/UsersList'

const page = async () => {
    const users= await prisma.internalUser.findMany()
  return (
    <div>
      <TableHeader buttonText='Create User' heading='Users List' route={`/users/create`} />
      <UsersList users={users} isForInternalUsers={true}/>
    </div>
  )
}

export default page

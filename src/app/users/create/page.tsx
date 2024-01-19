import AccessDenied from '@/app/access_denied/page'
import UserForm from '@/components/users/UserForm'
import { getUserSessionData } from '@/utils/utils'
import { UserRole } from '@prisma/client'
import React from 'react'

const page = async () => {
  const sessionData = await getUserSessionData()

  return (
    <>
      {sessionData?.role === UserRole.MANAGER ? <UserForm isForUpdate={false} />: <AccessDenied />}
    </>
  )
}

export default page

import UserForm from '@/components/users/UserForm'
import React from 'react'

const page = () => {
  return (
    <UserForm isForVendorUser={true} isForUpdate={false}/>
  )
}

export default page

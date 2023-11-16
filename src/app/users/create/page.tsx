import UserRegistrationForm from '@/components/userForm'
import React from 'react'

const page = () => {
  return (
    <UserRegistrationForm isForInternalUser={true} isForUpdate={false}/>
  )
}

export default page

import UserRegistrationForm from '@/components/users/UserForm'
import React from 'react'

const page = () => {
  return (
    <UserRegistrationForm isForInternalUser={true} isForUpdate={false}/>
  )
}

export default page

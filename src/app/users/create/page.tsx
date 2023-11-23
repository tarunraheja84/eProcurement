import UserRegistrationForm from '@/components/UserForm'
import React from 'react'

const page = () => {
  return (
    <UserRegistrationForm isForInternalUser={true} isForUpdate={false}/>
  )
}

export default page

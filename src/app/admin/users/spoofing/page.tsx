import React from 'react'
import Spoofing from './spoofing'
import { accessSecret, getUserSessionData } from '@/utils/utils'
import { UserRole } from '@prisma/client';
import AccessDenied from '@/app/access_denied/page';

const page = async () => {
  const [session, spoofingTimeout] = await Promise.all([
    getUserSessionData(),
    accessSecret("SPOOFING_TIMEOUT")
  ]) 
  // if (session?.role !== UserRole.MANAGER) return <AccessDenied/>
  return (
    <Spoofing spoofingTimeout={Number(spoofingTimeout)}/>
  )
}

export default page
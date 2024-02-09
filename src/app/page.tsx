'use client'
import React from 'react';
import { UserType } from '@/types/enums';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const session: UserSession | undefined = useSession().data?.user;
  const isVendorLogin = session?.userType === UserType.VENDOR_USER ? true : false
  const router = useRouter();
  if (isVendorLogin) {
    return router.push("/vendor")
  }
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      {session?.name && (
        <div className="bg-custom-theme p-8 rounded-lg shadow-lg text-center text-custom-buttonText">
          <h1 className="text-3xl font-bold mb-4 animate-bounce">{`Welcome, ${session?.name}!`}</h1>
          <p className="text-custom-buttonText">Your expertise and commitment continue to drive our collective progress.</p>
          <p className="text-custom-buttonText">Access your workspace, connect with colleagues, and explore opportunities to innovate.</p>
          <p className="text-custom-buttonText">Thank you for being a pivotal part of our mission!</p>
        </div>
      )}
    </div>
  );
}

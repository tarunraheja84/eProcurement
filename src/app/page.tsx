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
        <div className="bg-custom-theme from-red-500 to-red-600 p-8 rounded-lg shadow-lg text-center text-white">
          <h1 className="text-3xl font-bold mb-4 animate-bounce">{`Welcome, ${session?.name}!`}</h1>
          <p className="text-custom-gray-1">Your expertise and commitment continue to drive our collective progress.</p>
          <p className="text-custom-gray-1">Access your workspace, connect with colleagues, and explore opportunities to innovate.</p>
          <p className="text-custom-gray-1">Thank you for being a pivotal part of our mission!</p>
        </div>
      )}
    </div>
  );
}

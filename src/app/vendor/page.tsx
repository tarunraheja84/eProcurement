'use client'
import { useSession } from 'next-auth/react';
import React from 'react';

export default function VendorHomePage() {
  const session: UserSession | undefined = useSession().data?.user;
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-custom-theme p-8 rounded-lg shadow-lg text-center text-custom-buttonText ">
        <h1 className="text-3xl font-bold mb-4 animate-bounce">{`Welcome ${session?.name ? session?.name : ""}!`}</h1>
        <p className="text-custom-buttonText ">{`We're glad you're here. Dive into our platform and explore what offer.`}</p>
      </div>
    </div>
  );
}

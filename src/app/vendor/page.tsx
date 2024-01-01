import React from 'react';

export default function VendorHomePage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-custom-red from-red-500 to-red-600 p-8 rounded-lg shadow-lg text-center text-white ">
        <h1 className="text-3xl font-bold mb-4 animate-bounce">Welcome, User!</h1>
        <p className="text-gray-200 ">{`We're glad you're here. Dive into our platform and explore what we have to offer.`}</p>
      </div>
    </div>
  );
}

'use client'
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AccessDenied = () => {
  const router = useRouter()
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-70px)] bg-white">
      <Image
        src="/access-denied.png"
        alt="Access Denied"
        width={200}
        height={190}
      />

      <div className="items-center flex flex-col">
        <div className="text-xl font-bold mt-[30px] text-center">
          Access Denied
        </div>

        <div className="w-[218px] text-center mb-[45px] mt-[15px]">
          You do not have permission to view this page
        </div>

        <div
          onClick={() => {router.back()}}
          className={`md:w-[210px] w-[153px] h-[44px] md:h-[48px] border-solid border-[1px] bg-custom-red text-[#FFFFFF] flex justify-center items-center text-[14px] cursor-pointer ml-[11px] `}
        >
          <div></div>

          <div>Go Back</div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;

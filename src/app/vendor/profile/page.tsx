import React from "react";
import Profile from "./profile";
import { cookies } from 'next/headers';

export default async function page() {
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value
    const vendorDetails: any = await prisma.vendor.findUnique({
        where: {
            vendorId: vendorId
        }
        
    })
    return (
        <>
            <Profile vendorDetails={vendorDetails}/>
        </>
    );
}

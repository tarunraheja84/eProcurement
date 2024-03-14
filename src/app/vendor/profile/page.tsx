import React from "react";
import prisma from '@/lib/prisma';
import Profile from "@/components/profile/Profile";
import { cookies } from 'next/headers';
import { getUserEmail } from "@/utils/utils";

export default async function page() {
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value
    const userEmailId= await getUserEmail();
    const [vendorDetails, user] = await Promise.all([
        prisma.vendor.findUnique({
            where: {
                vendorId: vendorId
            }    
        }),
        prisma.vendorUser.findUnique({
            where: {
                email: userEmailId!
            }    
        })
    ]);
    return (
            <Profile vendorDetails={vendorDetails} user={user}/>
    );
}

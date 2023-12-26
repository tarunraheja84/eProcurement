import React from "react";
import Profile from "./profile";

export default async function page() {

    const vendorDetails: any = await prisma.vendor.findUnique({
        where: {
            vendorId: "65816843d22ea5564c8ba63c"
        }
        
    })
    return (
        <>
            <Profile vendorDetails={vendorDetails}/>
        </>
    );
}

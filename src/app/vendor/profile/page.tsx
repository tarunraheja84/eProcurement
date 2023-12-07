import React from "react";
import Profile from "./profile";

export default async function page() {

    const vendorDetails: any = await prisma.vendor.findUnique({
        where: {
            vendorId: "65362fe43ee4ee234d73f4cc"
        }
        
    })
    return (
        <>
            <Profile vendorDetails={vendorDetails}/>
        </>
    );
}

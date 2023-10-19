import VendorsPageHeader from "@/components/vendorsPageHeader"
import prisma from '@/lib/prisma'
import { Vendor } from "@prisma/client";
import VendorsList from "./vendorsList";
const page = async () => {
    const vendors: Vendor[] = await prisma.vendor.findMany({
        orderBy: {
            updatedAt: 'desc'
        }
    });
    return (
        <div>
            <VendorsPageHeader/>
            <VendorsList vendors={vendors}/>
        </div>
    )
}

export default page
import prisma from '@/lib/prisma'
import { Vendor } from "@prisma/client";
import VendorsList from "./vendorsList";
import TableHeader from "@/components/tableHeader";
const page = async () => {
    const vendors: Vendor[] = await prisma.vendor.findMany({
        orderBy: {
            updatedAt: 'desc'
        }
    });
    return (
        <div>
            <TableHeader buttonText='Create Vendor' heading='Vendors List' route='/vendors/create'/>
            <VendorsList vendors={vendors}/>
        </div>
    )
}

export default page
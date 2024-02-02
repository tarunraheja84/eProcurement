import ViewVendor from "@/components/vendors/ViewVendor";

export default async function page(context:any) {
    const vendorId= context.params.vendorId;
    const vendorDetails = await prisma.vendor.findUnique({
        where: {
            vendorId: vendorId
        }    
    });

    const user = await prisma.vendorUser.findUnique({
        where: {
            email: vendorDetails?.createdBy!
        }    
    })
        
    return (
        <ViewVendor vendorDetails={vendorDetails} user={user}/>
    );
}

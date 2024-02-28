import ViewVendor from "@/components/vendors/ViewVendor";
import { accessSecret } from "@/utils/utils";
import { UserRole } from "@prisma/client";

export default async function page(context:any) {
    const vendorId= context.params.vendorId;
    const vendorDetails = await prisma.vendor.findUnique({
        where: {
            vendorId: vendorId
        }    
    });

    let [user, spoofingTimeout] = await Promise.all([prisma.vendorUser.findUnique({
        where: {
            email: vendorDetails?.createdBy!
        }    
    }), accessSecret("SPOOFING_TIMEOUT")])

    if(!user){
        user = await prisma.vendorUser.findFirst({
            where: {
                vendorId: vendorDetails?.vendorId!,
                role:UserRole.ADMIN
            }    
        })
        if(!user){
            user = await prisma.vendorUser.findFirst({
                where: {
                    vendorId: vendorDetails?.vendorId!
                }    
            })
        }
    }
        
    return (
        <ViewVendor vendorDetails={vendorDetails} user={user} spoofingTimeout={Number(spoofingTimeout)}/>
    );
}

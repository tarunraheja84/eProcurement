import ViewVendor from "@/components/vendors/ViewVendor";
import { accessSecret } from "@/utils/utils";

export default async function page(context:any) {
    const vendorId= context.params.vendorId;
    const vendorDetails = await prisma.vendor.findUnique({
        where: {
            vendorId: vendorId
        }    
    });

    const [user, spoofingTimeout] = await Promise.all([prisma.vendorUser.findUnique({
        where: {
            email: vendorDetails?.createdBy!
        }    
    }), accessSecret("SPOOFING_TIMEOUT")])
        
    return (
        <ViewVendor vendorDetails={vendorDetails} user={user} spoofingTimeout={Number(spoofingTimeout)}/>
    );
}

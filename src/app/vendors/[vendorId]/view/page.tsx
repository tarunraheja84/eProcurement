import Profile from "@/components/profile/Profile";
import ViewVendor from "@/components/vendors/ViewVendor";

export default async function page(context:any) {
    const vendorId= context.params.vendorId;
    const vendor = await prisma.vendor.findUnique({
        where: {
            vendorId: vendorId
        }
    })

    return (
        <ViewVendor vendor={vendor}/>
    );
}

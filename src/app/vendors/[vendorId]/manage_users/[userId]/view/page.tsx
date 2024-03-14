import ViewUser from "@/components/users/ViewUser";
import prisma from '@/lib/prisma';

const page = async (context: any) => {
    const vendorId = context.params.vendorId;
    const userId = context.params.userId;
    const [vendorUser, vendor] = await Promise.all([prisma.vendorUser.findUnique({
        where: {
            userId: userId
        }
    }),
    prisma.vendor.findUnique({
        where: {
            vendorId: vendorId
        }
    })])
    return (
        <ViewUser user={vendorUser!} vendor={vendor!} />
    )
}

export default page
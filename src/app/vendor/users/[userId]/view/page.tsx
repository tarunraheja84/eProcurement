import ViewUser from "@/components/users/ViewUser";
import { cookies } from "next/headers";
import prisma from '@/lib/prisma';

const page = async (context: any) => {
    const userId = context.params.userId;
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value
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
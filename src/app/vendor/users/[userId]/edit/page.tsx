import UserForm from "@/components/users/UserForm"
import { cookies } from "next/headers";
import prisma from '@/lib/prisma';

const page = async (context: any) => {
  const userId = context.params.userId;
  const cookieStore = cookies();
  const vendorId = cookieStore.get("vendorId")?.value
  const vendorUser = await prisma.vendorUser.findUnique({
    where: {
      userId: userId
    }
  })
  return (
     <UserForm vendorUser={vendorUser!} vendorId={vendorId} isForVendorUser={true} isForUpdate={true} />
  )
}

export default page
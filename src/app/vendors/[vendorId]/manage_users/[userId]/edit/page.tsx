import UserForm from "@/components/users/UserForm";
import prisma from '@/lib/prisma';

const page = async (context: any) => {
  const userId = context.params.userId;
  const vendorUser = await prisma.vendorUser.findUnique({
    where: {
      userId: userId
    }
  })
  return <UserForm vendorUser={vendorUser!} isForVendorUser={true} isForUpdate={true}/>
  
}

export default page
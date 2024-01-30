import UserRegistrationForm from "@/components/UserForm"

const page = async (context: any) => {
  const userId = context.params.userId;
  const vendorId = context.params.vendorId;
  const vendorUser = await prisma.vendorUser.findUnique({
    where: {
      userId: userId
    }
  })
  return vendorUser && <UserRegistrationForm isForVendorUser={true} vendorUser={vendorUser} vendorId={vendorId} isForUpdate={true}/>
  
}

export default page
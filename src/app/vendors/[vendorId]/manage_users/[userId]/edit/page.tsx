import UserRegistrationForm from "@/components/userForm"

const page = async (context: any) => {
  const userId = context.params.userId;
  const vendorId = context.params.vendorId;
  const vendorUser = await prisma.vendorUser.findUnique({
    where: {
      userId: userId
    }
  })
  return (
    <div>
        <UserRegistrationForm isForVendorUser={true} vendorUser={vendorUser} vendorId={vendorId} isForUpdate={true}/>
    </div>
  )
}

export default page
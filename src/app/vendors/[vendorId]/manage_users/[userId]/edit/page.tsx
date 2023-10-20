import UserRegistrationForm from "@/components/userForm"

const page = async (context: any) => {
  const userId = context.params.userId;
  const vendorId = context.params.vendorId;
  const user = await prisma.vendorUser.findUnique({
    where: {
      userId: userId
    }
  })
  return (
    <div>
        <UserRegistrationForm user={user} vendorId={vendorId} isForUpdate={true}/>
    </div>
  )
}

export default page
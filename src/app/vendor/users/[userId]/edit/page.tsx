import UserForm from "@/components/users/UserForm"
import { cookies } from "next/headers";

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
    <>
      {vendorUser && <UserForm vendorUser={vendorUser} vendorId={vendorId} isForUpdate={true} />}
    </>
  )
}

export default page
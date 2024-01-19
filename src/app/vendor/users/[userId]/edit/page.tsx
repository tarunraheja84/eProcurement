import AccessDenied from "@/app/access_denied/page";
import UserForm from "@/components/users/UserForm"
import { getUserSessionData } from "@/utils/utils";
import { UserRole } from "@prisma/client";
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
  const sessionData = await getUserSessionData()
  return (
    <>
      {sessionData?.role === UserRole.MANAGER && vendorUser ? <UserForm vendorUser={vendorUser} vendorId={vendorId} isForUpdate={true} /> : <AccessDenied />}
    </>
  )
}

export default page
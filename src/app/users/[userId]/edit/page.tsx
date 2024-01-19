import AccessDenied from "@/app/access_denied/page";
import UserForm from "@/components/users/UserForm"
import prisma from '@/lib/prisma'
import { getUserSessionData } from "@/utils/utils";
import { UserRole } from "@prisma/client";

const page = async (context: any) => {
  const userId = context.params.userId;
  const internalUser = await prisma.internalUser.findUnique({
    where: {
      userId: userId
    }
  })
  const sessionData = await getUserSessionData()
  return (
    <>
        {sessionData?.role === UserRole.MANAGER && internalUser ? <UserForm internalUser={internalUser} isForUpdate={true}/>:
        <AccessDenied />}
    </>
  )
}

export default page
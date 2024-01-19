import AccessDenied from "@/app/access_denied/page";
import UserForm from "@/components/users/UserForm"
import { getUserSessionData } from "@/utils/utils";
import { UserRole } from "@prisma/client";
import { cookies } from "next/headers";

const page = async () => {
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value
    const sessionData = await getUserSessionData()
  return (
    <>
        {sessionData?.role === UserRole.MANAGER ? <UserForm vendorId={vendorId} isForUpdate={false}/>: < AccessDenied/>}
    </>
  )
}

export default page
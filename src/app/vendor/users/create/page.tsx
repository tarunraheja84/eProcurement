import UserForm from "@/components/users/UserForm"
import { cookies } from "next/headers";

const page = async () => {
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value
  return (
        <UserForm vendorId={vendorId} isForVendorUser={true} isForUpdate={false}/>
  )
}

export default page
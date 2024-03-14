import VendorUserRolePermissions from "@/components/profile/VendorUserRolePermissions"
import prisma from '@/lib/prisma';


const page = async () => {
    const vendorUserRolePermissions=await prisma.settings.findUnique({
      where:{
        settingsName:"vendorUserRolePermissions"
      }
    })
    return (
      <VendorUserRolePermissions vendorUserRolePermissions={vendorUserRolePermissions!}/>
    )
}

export default page

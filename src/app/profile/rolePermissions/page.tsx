import InternalUserRolePermissions from "@/components/profile/InternalUserRolePermissions"


const page = async () => {
    const internalUserRolePermissions=await prisma.settings.findUnique({
      where:{
        settingsName:"internalUserRolePermissions"
      }
    })
    return (
      <InternalUserRolePermissions internalUserRolePermissions={internalUserRolePermissions!}/>
    )
}

export default page

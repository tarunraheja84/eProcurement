import UserForm from "@/components/users/UserForm"
import prisma from '@/lib/prisma'

const page = async (context: any) => {
  const userId = context.params.userId;
  const internalUser = await prisma.internalUser.findUnique({
    where: {
      userId: userId
    }
  })
  
  return (
    <>
        { internalUser &&  <UserForm internalUser={internalUser} isForUpdate={true}/>}
    </>
  )
}

export default page
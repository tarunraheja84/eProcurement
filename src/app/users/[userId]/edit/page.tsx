import UserRegistrationForm from "@/components/UserForm"
import prisma from '@/lib/prisma'

const page = async (context: any) => {
  const userId = context.params.userId;
  const internalUser = await prisma.internalUser.findUnique({
    where: {
      userId: userId
    }
  })
  return (
    <div>
        {internalUser && <UserRegistrationForm isForInternalUser={true} internalUser={internalUser} isForUpdate={true}/>}
    </div>
  )
}

export default page
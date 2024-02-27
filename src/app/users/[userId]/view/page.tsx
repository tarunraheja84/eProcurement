import ViewUser from '@/components/users/ViewUser';
import prisma from '@/lib/prisma'

const page = async (context: any) => {
  const userId = context.params.userId;
  const user = await prisma.internalUser.findUnique({
    where: {
      userId: userId
    }
  })
  return (
    <ViewUser user={user!}/>
  )
}

export default page
import { getUserEmail } from "@/utils/utils";
import prisma from '@/lib/prisma';
import Profile from "@/components/profile/Profile";

export default async function page() {
    const userEmailId = await getUserEmail();
    const user = await prisma.internalUser.findUnique({
        where: {
            email: userEmailId!
        }
    })

    return (
        <Profile user={user}/>
    );
}

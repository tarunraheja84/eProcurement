import OrdersHistory from '@/components/OrdersHistory'
import {
    subDays,
    endOfDay,
} from 'date-fns';
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers';

const page = async () => {
    const cookieStore = cookies();
    const vendorId = cookieStore.get("vendorId")?.value
    const today = new Date();
    const orders = await prisma.order.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
        where: {
            createdAt: {
                gte: subDays(today, 6),
                lte: endOfDay(today)
            },
            vendorId: vendorId
        }
    })
    return <OrdersHistory orders={orders} />
}

export default page

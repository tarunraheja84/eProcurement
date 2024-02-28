
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers';
import OrdersHistory from '@/components/orders/OrdersHistory';

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
            vendorId: vendorId
        }
    })
    return <OrdersHistory orders={orders} />
}

export default page

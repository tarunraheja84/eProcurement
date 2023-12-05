import OrdersHistory from '@/components/OrdersHistory'
import {
  subDays,
  endOfDay,
} from 'date-fns';
import prisma from '@/lib/prisma'

const page = async () => {
  const today = new Date();
  const orders = await prisma.order.findMany({
    orderBy:{
      updatedAt: 'desc'
    },
    take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
    where: {
      createdAt: {
        gte: subDays(today, 6),
        lte: endOfDay(today)
      }
    }
  })
  return <OrdersHistory orders={orders} />
}

export default page

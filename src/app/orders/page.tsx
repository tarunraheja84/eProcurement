import OrdersHistory from '@/components/orders/OrdersHistory'
import prisma from '@/lib/prisma'

const page = async () => {
  const orders = await prisma.order.findMany({
    orderBy:{
      updatedAt: 'desc'
    },
    take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
  })
  return <OrdersHistory orders={orders} />
}

export default page

import OrdersHistory from '@/components/OrdersHistory'
import {
  subDays,
  endOfDay,
} from 'date-fns';

const page = async () => {
  const today = new Date();
  const orders = await prisma.order.findMany({
    take: 4,
    where: {
      vendorId: "65362fe43ee4ee234d73f4cc",
      createdAt: {
        gte: subDays(today, 6),
        lte: endOfDay(today)
      }
    }
  })
  return <OrdersHistory orders={orders} />
}

export default page

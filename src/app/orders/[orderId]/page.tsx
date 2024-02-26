import OrderDetail from '@/components/orders/OrderDetail'
import React from 'react'
import prisma from '@/lib/prisma'

const page = async (context: any) => {

  
  const order:any= await prisma.order.findUnique({ // TODO: remove this any
    where: {
      orderId: context.params.orderId
    },
  })
  return (
    order && <OrderDetail order={order} isViewOnly={true} />
  )
}

export default page

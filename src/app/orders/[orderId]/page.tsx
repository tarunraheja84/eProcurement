import ViewOrder from '@/components/ViewOrder'
import React from 'react'
import prisma from '@/lib/prisma'

const page = async (context:any) => {
    const order= await prisma.order.findUnique({
        where:{
          orderId:context.params.orderId
        },
    })
  return (
    order && <ViewOrder order={order} />
  )
}

export default page

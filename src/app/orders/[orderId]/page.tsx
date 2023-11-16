import ViewOrder from '@/components/ViewOrder'
import React from 'react'

const page = async (context:any) => {
    const order= await prisma.order.findUnique({
        where:{
          orderId:context.params.orderId
        },
    })
  return (
    <ViewOrder order={order} />
  )
}

export default page

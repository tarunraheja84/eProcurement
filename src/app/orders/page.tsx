import OrdersHistory from '@/components/OrdersHistory'

import React from 'react'

const page = async () => {
    const orders= await prisma.order.findMany({
        where:{
          vendorId:"65362fe43ee4ee234d73f4cc"
        }
    })
  return <OrdersHistory orders={orders}/>
  
}

export default page

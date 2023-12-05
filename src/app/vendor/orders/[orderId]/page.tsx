import React from 'react'
import OrderClientComponent from './orderClientComponent'
import { Order } from '@/types/order';
import { OrderStatus } from '@prisma/client';

const page = async (context : any) => {
  const orderId = context.params.orderId;
  const order : any = await prisma.order.findUnique({ 
    where : {
      orderId : orderId,
    }
  })
  let isViewOnly = false;
  if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) isViewOnly = true
  return (
    <>
    <OrderClientComponent order={order} isViewOnly={isViewOnly}></OrderClientComponent>
    </>
  )
}

export default page
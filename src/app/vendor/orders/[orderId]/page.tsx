import React from 'react'
import OrderClientComponent from './orderClientComponent'
import { OrderStatus } from '@prisma/client';
import prisma from '@/lib/prisma';


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
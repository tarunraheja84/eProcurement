'use client'
import VendorOrderLineItem from '@/components/vendorOrderLineItem';
import { OrderStatus } from '@/types/enums';
import { Order, OrderItem } from '@/types/order';
import axios from 'axios';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
interface Props {
  order: Order,
  isViewOnly: boolean
}
const OrderClientComponent = (props: Props) => {
  const [order, setOrder] = useState<Order>(props.order);
  const isViewOnly = props.isViewOnly

  async function handleOrderUpdate(arg0: string): Promise<void> {
    if (arg0 === "ACCEPT") order.status = OrderStatus.ACCEPTED
    if (arg0 === "CANCEL") order.status = OrderStatus.CANCELLED
    const orderId = order.orderId
    delete order.orderId
    const result = await axios.post("/api/orders/update", { order, orderId })
    if (result.status === 201) {
      if (arg0 === "ACCEPT") alert("Order Accepted Successfully!")
      if (arg0 === "CANCEL") alert("Order Cancelled Successfully!")
    }
  }

  async function handleCancle(): Promise<void> {
    order.orderItems.map((lineItem : OrderItem) => {
      lineItem.isSellerAccepted = false;
      lineItem.acceptedQty = 0;
    })
    order.total = 0;
    order.totalTax = 0;
    order.totalAmount = 0;
    setOrder({...order});
    await handleOrderUpdate("CANCEL");
  }

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold text-custom-red mb-4">Order Details</h1>
      <hr className="border-custom-red border mb-4" />
      <div className="flex justify-between items-center mb-6">
        <div>

          <div className='flex'>
            <p className="font-bold text-gray-600">Order Id: </p><span className="text-gray-600">{order.orderId}</span>
          </div>
          <div className='flex'>
            <p className="font-bold text-gray-600">Status:  </p><span className="text-gray-600">{order.status}</span>
          </div>
          <div className='flex'>
            <p className="font-bold text-gray-600">Expt. Delivery Date:  </p><span className="text-gray-600">{order.createdAt?.toDateString()}</span>
          </div>
        </div>
        {order.status === OrderStatus.PENDING && <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button className="bg-custom-red hover:bg-hover-red text-white px-4 py-2 rounded-md" onClick={handleCancle} >Cancel Order</button>
          </div>
        </div>}
      </div>

      <h3 className="text-xl font-bold mb-2">Items Requested</h3>
      <div>
        {order.orderItems.map((lineItem: OrderItem) => (
          <VendorOrderLineItem key={Math.random()} lineItem={lineItem} order={order} setOrder={setOrder} />
        ))}
      </div>
      <div className="flex flex-row mt-4 justify-between" >
        <div className="mt-4">
          <h3 className="text-lg font-medium">Delivery Address</h3>
          <div className="flex flex-col">
            <p className="text-base font-regular">{order.deliveryAddress}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-lg font-medium">Subtotal: ₹ <span className='text-green-500'> {order.totalAmount}</span></div>
          <div className="text-lg font-medium">Total Tax: ₹ <span className='text-green-500'>{order.totalTax}</span></div>
      <hr className="border-gray-500 border mb-4" />

          <div className="text-lg font-bold">Total Amount: ₹ <span className='text-green-500'>{order.total}</span></div>
        </div>

      </div>
      {!isViewOnly && <div className="flex justify-center gap-[2rem] mt-[50px] fixed bottom-0 left-0 right-0">
        <Button
          label={`${order.total > 0 ? "ACCEPT" : "CANCEL"} ORDER`}
          type="submit"
          icon="pi pi-check"
          className={`w-full mb-[1rem] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none bg-custom-red`}
          onClick={() => handleOrderUpdate(`${order.total > 0 ? "ACCEPT" : "CANCEL"}`)}
        />
      </div>}
    </div>
  );
};

export default OrderClientComponent;

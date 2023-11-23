import { Order, OrderStatus } from '@prisma/client';
import  { createContext } from 'react';

type Types = {
  startDate: Date | null,
  setStartDate: Function,
  endDate: Date | null,
  setEndDate: Function,
  status: string,
  setStatus: Function,
  filteredOrders: Order[],
  setFilteredOrders: Function,
  page: number,
  setPage: Function
};

export const OrdersContext = createContext<Types>({
    startDate:new Date(),
    setStartDate: ()=>{},
    endDate:new Date(),
    setEndDate: ()=>{},
    status: OrderStatus.PENDING,
    setStatus :()=>{},
    filteredOrders: [],
    setFilteredOrders: ()=>{},
    page: 0,
    setPage:()=>{}
})
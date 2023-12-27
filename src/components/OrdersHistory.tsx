"use client"
import { Order, OrderStatus } from '@prisma/client'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import {
  subDays,
  startOfDay,
  endOfDay,
} from 'date-fns';
import Loading from '@/app/loading';
import { convertDateTime, statusColor } from '@/utils/helperFrontendFunctions';
import DateRangePicker from './DateRangePicker';
import { OrdersFilterType } from '@/types/enums';

type Props = {
  orders: Order[]
}

const OrdersHistory = ({ orders }: Props) => {
  const router = useRouter();
  const today = new Date();
  const [status, setStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<OrdersFilterType>(OrdersFilterType.orderDate)
  const [startDate, setStartDate] = useState<Date | null>(startOfDay(subDays(today, 6)));
  const [endDate, setEndDate] = useState<Date | null>(endOfDay(today));
  const [marketPlaceOrderId, setMarketPlaceOrderId] = useState("");
  const [filters, setFilters] = useState(true);
  const [page, setPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);


  const fetchMoreOrders = async () => {
    try {
      const result = await axios.post(`/api/orders`, { page: page, startDate: startDate, endDate: endDate, status: status, filterType: filterType });
      setFilteredOrders((prev: Order[]) => [...prev, ...result.data]);
      setPage(page + 1);

      if (!result.data.length) {
        setHasMore(false);
      }
    }
    catch (error) {
      console.log('error  :>> ', error);
    }
  }

  const disableFilters=()=>{
      const filters=document.getElementsByClassName("filter");
      for(const filter of Array.from(filters)){
        filter.setAttribute('disabled', 'true');
      }
  }

  const enableFilters=()=>{
    const filters=document.getElementsByClassName("filter");
    for(const filter of Array.from(filters)){
      filter.removeAttribute('disabled');
    }
}

  const applyFilters = async () => {
    try {
      setLoading(true);
      const result = await axios.post(`/api/orders`, { page: 0, startDate: startDate, endDate: endDate, status: status, filterType: filterType, marketPlaceOrderId: marketPlaceOrderId });
      setFilteredOrders(result.data);
      setPage(1);
      if (!result.data.length) {
        setHasMore(false);
      }
    } catch (error) {
      console.log('error  :>> ', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!filteredOrders.length)
      setHasMore(false);
  }, []);


  return (
    <>
      <h1 className="text-2xl font-bold text-custom-red mb-4">Orders History</h1>
      <hr className="border-custom-red border" />

      {/* filters */}
      <div className="md:flex bg-custom-gray-3 my-4 rounded-md">
        <div className="w-[90vw]">
        <div className="md:flex justify-between">
          <div className="flex flex-col md:flex-row justify-between p-4 md:py-2 space-y-4 md:space-y-0 md:space-x-4">
            <div className="my-auto md:pt-2">
              <label className="text-sm font-medium text-custom-gray-5">Start Date: </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date as Date);
                  const dateRange = document.getElementById("dateRange");
                  const customOption = dateRange?.querySelector('option[value="custom"]');
                  (customOption as any).selected = true;
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="MMMM d, yyyy"
                className="filter w-full px-2 border rounded-md cursor-pointer outline-none"
              />
            </div>

            <div className="my-auto md:pt-2">
              <label className="text-sm font-medium text-custom-gray-5">End Date: </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date as Date);
                  const dateRange = document.getElementById("dateRange");
                  const customOption = dateRange?.querySelector('option[value="custom"]');
                  (customOption as any).selected = true;
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="MMMM d, yyyy"
                className="filter w-full px-2 border rounded-md cursor-pointer outline-none"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between my-auto p-4 md:py-2 space-y-4 md:space-y-0">
            <div className="my-auto md:pt-2">
              <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Date Range: </label>
              <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
            </div>

            <div className="my-auto md:pt-2">
              <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Filter By: </label>
              <select
                id="filterType"
                defaultValue={OrdersFilterType.orderDate}
                className="filter md:ml-2 focus:outline-none cursor-pointer rounded-md"
                onChange={(e) => {
                  setFilterType(e.target.value as OrdersFilterType)
                  const status = document.getElementById("status");
                  const deliveredOption = status?.querySelector(`option[value=${OrderStatus.DELIVERED}]`);
                  (deliveredOption as any).selected = true;
                  setStatus(OrderStatus.DELIVERED);
                }}
              >
                <option value={OrdersFilterType.orderDate}>Order Date</option>
                <option value={OrdersFilterType.deliveryDate}>Delivery Date</option>
              </select>
            </div>

            <div className="my-auto md:pt-2">
              <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Status: </label>
              <select
                id="status"
                defaultValue={status}
                className="filter md:ml-2 focus:outline-none cursor-pointer rounded-md"
                onChange={(e) => {
                  setStatus(e.target.value);
                  if (e.target.value !== OrderStatus.DELIVERED) {
                    const filterType = document.getElementById("filterType");
                    const orderDate = filterType?.querySelector(`option[value=${OrdersFilterType.orderDate}]`);
                    (orderDate as any).selected = true;
                  }
                }}
              >
                <option value="">All</option>
                <option value={OrderStatus.PENDING}>PENDING</option>
                <option value={OrderStatus.DELIVERED}>DELIVERED</option>
                <option value={OrderStatus.CONFIRMED}>CONFIRMED</option>
                <option value={OrderStatus.CANCELLED}>CANCELLED</option>
              </select>
            </div>
          </div>

        </div>

        <div className="my-auto md:pt-2 p-4">
          <label className="text-sm font-medium text-custom-gray-5">Enter MarketPlaceOrderId: </label>
          <input type="text" placeholder="MarketPlaceOrderId"
            onChange={(e) => {
              if(e.target.value) disableFilters();
              else enableFilters();
              setMarketPlaceOrderId(e.target.value)
            }
          }
            className="md:ml-2 px-2 focus:outline-none rounded-md" />
        </div>

        </div>

        <div className="my-auto flex items-center justify-center p-4">
          <div className="h-fit md:ml-4 p-2 mt-2 md:mt-0 bg-custom-red hover:bg-hover-red text-white rounded-md outline-none cursor-pointer"
            onClick={applyFilters}>
            Apply&nbsp;Filters
          </div>
        </div>

      </div>

      {loading ? <Loading /> :
        <InfiniteScroll
          dataLength={filteredOrders.length} //This is important field to render the next data
          next={fetchMoreOrders}
          hasMore={hasMore}
          loader={<div className="flex justify-center"><Image height={32} width={32} src="/loader.gif" alt="Loading..." /></div>}
        >
          {filteredOrders.length ? filteredOrders.map((order: Order, index: number) => (
            <div key={index} className="p-6 rounded-lg shadow-md w-full mb-2 bg-custom-gray-1">
              <p><span className="mb-2 font-bold">Order ID: </span><span className="underline text-custom-link-blue cursor-pointer break-all" onClick={() => { router.push(`/orders/${order.orderId}`) }}>{order.orderId}</span></p>
              <p><span className="font-bold mb-2">Order Date: </span>{convertDateTime(order.createdAt!.toString())}</p>
              <p><span className="font-bold mb-2">Delivery Address: </span>{order.deliveryAddress.addressLine}</p>
              {order.status === OrderStatus.DELIVERED && <p><span className="font-bold mb-2">Delivery Date: </span>{convertDateTime(order.deliveryDate!.toString())}</p>}
              <p><span className="font-bold mb-2">Status: </span><span className={statusColor(order.status)}>{order.status}</span></p>
              <p><span className="font-bold mb-4">Total: </span><span className="text-custom-green">₹{order.total}</span></p>
            </div>
          )) : <div className="text-center">No Orders to display</div>}
        </InfiniteScroll>}
    </>
  )
}

export default OrdersHistory

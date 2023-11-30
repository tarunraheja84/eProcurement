"use client"
import { Order, OrderStatus } from '@prisma/client'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import {
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns';
import Loading from '@/app/loading';
import { convertDateTime, statusColor } from '@/utils/helperFunctions';
import DateRangePicker from './DateRangePicker';

type Props = {
  orders: Order[]
}

const OrdersHistory = ({ orders }: Props) => {
  const router = useRouter();
  const today = new Date();
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(startOfDay(subDays(today, 6)));
  const [endDate, setEndDate] = useState<Date | null>(endOfDay(today));
  const [openFilterSidebar, setOpenFilterSidebar] = useState(false);
  const [page, setPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleFilterSidebar = () => {
    setOpenFilterSidebar(!openFilterSidebar);
  }

  const fetchMoreOrders = async () => {
    try {
      setLoading(true);
      const result = await axios.post(`/api/orders`, { page: page, startDate: startDate, endDate: endDate, status: status });
      setFilteredOrders((prev: Order[]) => [...prev, ...result.data]);
      setPage(page + 1);
      
      if (result.data.length === 0) {
        setHasMore(false);
      }
    }
    catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  const applyFilters = async () => {
    try {
      setLoading(true);
      const result = await axios.post(`/api/orders`, { page: 0, startDate: startDate, endDate: endDate, status: status });
      setFilteredOrders(result.data);
      setPage(1);
      if (result.data.length === 0) {
        setHasMore(false);
      }
      toggleFilterSidebar();
    } catch (error) {
      console.log(error)
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
          <div className="flex flex-col md:flex-row justify-between p-4 md:py-2 my-4 rounded-md bg-custom-gray-3 space-y-4 md:space-y-0">

            <div className={`flex flex-col md:flex-row justify-center md:items-center space-y-4 md:space-y-0 md:space-x-4`}>
              <div>
                <label className="text-sm font-medium text-custom-gray-5">Start Date: </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date as Date);
                    const dateRange = document.getElementById("dateRange");
                    if (dateRange) {
                      const customOption = dateRange.querySelector('option[value="custom"]');
                      if (customOption) {
                        (customOption as any).selected = true;
                      }
                    }
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MMMM d, yyyy"
                  className="w-full px-2 border rounded-md cursor-pointer outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-custom-gray-5">End Date: </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date as Date);
                    const dateRange = document.getElementById("dateRange");
                    if (dateRange) {
                      const customOption = dateRange.querySelector('option[value="custom"]');
                      if (customOption) {
                        (customOption as any).selected = true;
                      }
                    }
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MMMM d, yyyy"
                  className="w-full px-2 border rounded-md cursor-pointer outline-none"
                />
              </div>

            </div>

            <div className="flex flex-col md:flex-row my-auto space-y-4 md:space-y-0">
              <div className="my-auto">
                <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Date Range: </label>
                <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
              </div>

              <div className="my-auto xl:pt-2">
                <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Status: </label>
                <select
                  defaultValue={status}
                  className="md:ml-2 focus:outline-none cursor-pointer rounded-md"
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  <option value={OrderStatus.PENDING}>PENDING</option>
                  <option value={OrderStatus.DELIVERED}>DELIVERED</option>
                  <option value={OrderStatus.ACCEPTED}>ACCEPTED</option>
                  <option value={OrderStatus.CANCELLED}>CANCELLED</option>
                </select>
              </div>

              <div className="my-auto flex items-center justify-center ">
                <div className="h-fit md:ml-4 p-2 mt-2 md:mt-0 bg-custom-red hover:bg-hover-red text-white rounded-md outline-none cursor-pointer"
                  onClick={applyFilters}>
                  Apply&nbsp;Filters
                </div>
              </div>

            </div>
          </div>

    {loading ? <Loading />:
          <InfiniteScroll
            dataLength={filteredOrders.length} //This is important field to render the next data
            next={fetchMoreOrders}
            hasMore={hasMore}
            loader={<div className="flex justify-center"><Image height={32} width={32} src="/loader.gif" alt="Loading..." /></div>}
          >
            {filteredOrders.length ? filteredOrders.map((order: Order, index: number) => (
              <div key={index} className="p-6 rounded-lg shadow-md w-full mb-2 bg-custom-gray-1">
                <p><span className="mb-2 font-bold">Order ID: </span><span className="underline text-custom-link-blue cursor-pointer break-all" onClick={() => { router.push(`/orders/${order.orderId}`) }}>{order.orderId}</span></p>
                <p><span className="font-bold mb-2">Order Date: </span>{convertDateTime(order.createdAt.toString())}</p>
                <p><span className="font-bold mb-2">Delivery Address: </span>{order.deliveryAddress}</p>
                <p><span className="font-bold mb-2">Status: </span><span className={statusColor(order.status)}>{order.status}</span></p>
                <p><span className="font-bold mb-4">Total: </span><span className="text-custom-green">₹{order.total}</span></p>
              </div>
            )) : <div className="text-center">No Orders to display</div>}
          </InfiniteScroll>}
    </>
  )
}

export default OrdersHistory

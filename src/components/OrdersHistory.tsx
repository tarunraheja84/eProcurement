"use client"
import { Order, OrderStatus } from '@prisma/client'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
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
  const divRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const convertDateTime = (dateString: string) => {
    const date = new Date(dateString);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12;

    const formattedDate = `${dayOfWeek} ${month} ${day}, ${year}`;
    const formattedTime = `${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  }

  const statusColor = (orderStatus: String) => {
    switch (orderStatus) {
      case OrderStatus.PENDING:
        return "text-custom-yellow";
      case OrderStatus.CANCELLED:
        return "text-red-400";
      case OrderStatus.DELIVERED:
        return "text-custom-green"
    }
  }

  const toggleFilterSidebar = () => {
    setOpenFilterSidebar(!openFilterSidebar);
  }

  const fetchOrders = async () => {
    try {
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
  }

  const applyFilters = async () => {
    try {
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
  }
  const handlePresetClick = (preset: string) => {
    const today = new Date();

    switch (preset) {
      case 'yesterday':
        setStartDate(startOfDay(subDays(today, 1)));
        setEndDate(endOfDay(subDays(today, 1)));
        break;
      case 'last7days':
        setStartDate(startOfDay(subDays(today, 6)));
        setEndDate(endOfDay(today));
        break;
      case 'thismonth':
        setStartDate(startOfMonth(today));
        setEndDate(endOfDay(today));
        break;
      case 'lastmonth':
        setStartDate(startOfMonth(subMonths(today, 1)));
        setEndDate(endOfMonth(subMonths(today, 1)));
        break;
      case 'custom':
        setStartDate(null);
        setEndDate(null);
        break;
      default:
        setStartDate(null);
        setEndDate(null);
        break;
    }

  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-custom-red mb-4">Orders History</h1>
      <hr className="border-custom-red border" />

      {/* filters */}
      <div className="flex flex-col md:flex-row justify-between p-4 md:py-2 my-4 rounded-md bg-gray-300 space-y-4 md:space-y-0">

        <div className={`flex flex-col md:flex-row justify-center md:items-center space-y-4 md:space-y-0 md:space-x-4`}>
          <div>
            <label className="text-sm font-medium text-gray-700">Start Date: </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date as Date);
                const dateRange = document.getElementById("dateRange");
                if (dateRange) {
                  const customOption = dateRange.querySelector('option[value="custom"]');
                  console.log("Hello");
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
            <label className="text-sm font-medium text-gray-700">End Date: </label>
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
            <label className="md:ml-2 text-sm font-medium text-gray-700">Select Date Range: </label>
            <select
              id="dateRange"
              className="md:ml-2 focus:outline-none cursor-pointer rounded-md"
              onChange={(e) => {
                if (e.target.value) handlePresetClick(e.target.value);
              }}
              defaultValue="last7days"
            >
              <option value='yesterday'>Yesterday</option>
              <option value='last7days'>Last 7 days</option>
              <option value='thismonth'>This Month</option>
              <option value='lastmonth'>Last Month</option>
              <option value='custom'>Custom Range</option>
            </select>
          </div>

          <div className="my-auto xl:pt-2">
            <label className="md:ml-2 text-sm font-medium text-gray-700">Select Status: </label>
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

      <InfiniteScroll
        dataLength={filteredOrders.length} //This is important field to render the next data
        next={fetchOrders}
        hasMore={hasMore}
        loader={<div className="flex justify-center"><Image height={32} width={32} src="/loader.gif" alt="Loading..." /></div>}
      >
        {filteredOrders.length ? filteredOrders.map((order: Order, index: number) => (
          <div key={index} className="p-6 rounded-lg shadow-md w-full mb-2 bg-gray-100">
            <p><span className="mb-2 font-bold">Order ID: </span><span className="underline text-blue-700 cursor-pointer break-all" onClick={() => { router.push(`/orders/${order.orderId}`) }}>{order.orderId}</span></p>
            <p><span className="font-bold mb-2">Order Date: </span>{convertDateTime(order.createdAt.toString())}</p>
            <p><span className="font-bold mb-2">Delivery Address: </span>{order.deliveryAddress}</p>
            <p><span className="font-bold mb-2">Status: </span><span className={statusColor(order.status)}>{order.status}</span></p>
            <p><span className="font-bold mb-4">Total: </span><span className="text-custom-green">₹{order.total}</span></p>
          </div>
        )) : <div className="text-center">No Orders to display</div>}
      </InfiniteScroll>
    </div>
  )
}

export default OrdersHistory

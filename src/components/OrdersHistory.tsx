"use client"
import { Order, OrderStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns';


type Props={
  orders:Order[]
}

const OrdersHistory = ({ orders }:Props) => {

  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDateRange, setShowDateRange] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [status, setStatus] = useState<string>("");
  const divRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    setFilteredOrders(orders.filter((order: Order) => {
      if(startDate && endDate && status)
        return order.createdAt >= startDate && order.createdAt <= endDate && order.status === status;
      else if (startDate && endDate)
        return order.createdAt >= startDate && order.createdAt <= endDate;
      else if(status)
        return order.status === status;
      else
        return true;
    }))
  }, [startDate, endDate, status])

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

  const handlePresetClick = (e:any, preset: string) => {
    const today = new Date();

    if(divRef.current){
      const buttons = divRef.current.querySelectorAll('button');
      buttons.forEach((button) => {
        button.classList.remove("border-b-2", "border-black");
      });
    }

    switch (preset) {
      case 'yesterday':
        e.classList.add("border-b-2", "border-black");
        setStartDate(startOfDay(subDays(today, 1)));
        setEndDate(endOfDay(subDays(today, 1)));
        break;
      case 'last7days':
        e.classList.add("border-b-2", "border-black");
        setStartDate(startOfDay(subDays(today, 6)));
        setEndDate(endOfDay(today));
        break;
      case 'thismonth':
        e.classList.add("border-b-2", "border-black");
        setStartDate(startOfMonth(today));
        setEndDate(endOfDay(today));
        break;
      case 'lastmonth':
        e.classList.add("border-b-2", "border-black");
        setStartDate(startOfMonth(subMonths(today, 1)));
        setEndDate(endOfMonth(subMonths(today, 1)));
        break;
      case 'custom':
        e.classList.add("border-b-2", "border-black");
        break;
      default:
        e.classList.add("border-b-2", "border-black");
        setStartDate(null);
        setEndDate(null);
        break;
    }

    // Close options after selecting a preset
    setShowDateRange(false);
  };


  return (
    <div>
      <h1 className="text-2xl font-bold text-custom-red mb-4">Orders History</h1>
      <hr className="border-custom-red border" />
      <div className="mb-4">
        <div className="flex flex-col md:flex-row items-center justify-between">

          <div className='mt-4 md:hidden'>
            <label htmlFor='drp' className='border flex justify-between px-[10px] rounded-md'>
              <select
                className='focus:outline-none cursor-pointer'
                onChange={(e) => {
                  if (e.target.value) handlePresetClick(e.currentTarget, e.target.value);
                  setShowDateRange(true);
                }}
              >
                <option value='yesterday'>Yesterday</option>
                <option value='last7days'>Last 7 days</option>
                <option value='thismonth'>This Month</option>
                <option value='lastmonth'>Last Month</option>
                <option value=''>Custom Range</option>
              </select>
            </label>
          </div>

          <div className={`flex flex-col md:flex-row items-center md:space-x-4 mt-4 ${showDateRange ? "inline-block" : "invisible"}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date as Date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="MMMM d, yyyy"
                className="w-full p-2 border rounded-md cursor-pointer outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date as Date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                dateFormat="MMMM d, yyyy"
                className="w-full p-2 border rounded-md cursor-pointer outline-none"
              />
            </div>
          </div>

          <div ref={divRef} className="hidden md:flex items-center space-x-4 mt-4">
            {/* Preset buttons */}
            <button
              onClick={(e) => {
                handlePresetClick(e.currentTarget, 'yesterday');
                setShowDateRange(true)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md"
            >
              Yesterday
            </button>
            <button
              onClick={(e) => {
                handlePresetClick(e.currentTarget, 'last7days');
                setShowDateRange(true)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md"
            >
              Last 7 Days
            </button>
            <button
              onClick={(e) => {
                handlePresetClick(e.currentTarget, 'thismonth');
                setShowDateRange(true)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md"
            >
              This Month
            </button>
            <button
              onClick={(e) => {
                handlePresetClick(e.currentTarget,'lastmonth');
                setShowDateRange(true)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md"
            >
              Last Month
            </button>
            <button
              onClick={(e) => { 
                handlePresetClick(e.currentTarget,'custom');
                setShowDateRange(true) }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md"
            >
              Custom Range
            </button>
            <button
              onClick={(e) => {
                setStatus("");
                handlePresetClick(e.currentTarget, "");
                setShowDateRange(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md border-b-2 border-black"
            >
              All Orders
            </button>
            <div className='my-4 flex'>
              <label className="block text-sm font-medium text-gray-700">Select Status:</label>
              <select
                className='ml-2 border focus:outline-none cursor-pointer rounded-md'
                value={status}
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
          </div>
        </div>
      </div>
      {filteredOrders.length ? filteredOrders.map((order: Order, index: number) => (
        <div key={index} className="p-6 rounded-lg shadow-md w-full mb-2 bg-gray-100">
          <p><span className="mb-2 font-bold">Order ID: </span><span className="underline text-blue-700 cursor-pointer break-all" onClick={() => { router.push(`/orders/${order.orderId}`) }}>{order.orderId}</span></p>
          <p><span className="font-bold mb-2">Order Date: </span>{convertDateTime(order.createdAt.toString())}</p>
          <p><span className="font-bold mb-2">Delivery Address: </span>{order.deliveryAddress}</p>
          <p><span className="font-bold mb-2">Status: </span><span className={statusColor(order.status)}>{order.status}</span></p>
          <p><span className="font-bold mb-4">Total: </span><span className="text-custom-green">₹{order.total}</span></p>
        </div>
      )) : <div className="text-center">No Orders to display</div>}
    </div>
  )
}

export default OrdersHistory

import React from 'react'
import {
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns';

type Props={
  setStartDate:Function,
  setEndDate:Function
}

const DateRangePicker = ({setStartDate, setEndDate}:Props) => {

  const handlePresetClick = (preset: string) => {
    const today = new Date();
    switch (preset) {
      case 'yesterday':
        setStartDate(startOfDay(subDays(today, 1)));
        setEndDate(endOfDay(subDays(today, 1)));
        break;
      case 'last7days':
        setStartDate(subDays(today, 6));
        setEndDate(endOfDay(today));
        break;
      case 'thismonth':
        setStartDate(startOfMonth(today));
        setEndDate(null);
        break;
      case 'lastmonth':
        setStartDate(startOfMonth(subMonths(today, 1)));
        setEndDate(endOfMonth(subMonths(today, 1)));
        break;
      case 'all':
        setStartDate(null);
        setEndDate(null);
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
    <>
      <select
        id="dateRange"
        className="filter md:ml-2 focus:outline-none cursor-pointer rounded-md bg-white px-2"
        onChange={(e) => {
          if (e.target.value) handlePresetClick(e.target.value);
        }}
        defaultValue=''
      >
        <option value='all'>All</option>
        <option value='yesterday'>Yesterday</option>
        <option value='last7days'>Last 7 days</option>
        <option value='thismonth'>This Month</option>
        <option value='lastmonth'>Last Month</option>
        <option value='custom'>Custom Range</option>
      </select>
    </>
  )
}

export default DateRangePicker

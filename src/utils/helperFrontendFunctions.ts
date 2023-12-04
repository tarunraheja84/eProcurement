import { OrderStatus } from "@prisma/client";


export const statusColor = (orderStatus: String) => {
    switch (orderStatus) {
        case OrderStatus.PENDING:
            return "text-custom-yellow";
        case OrderStatus.CANCELLED:
            return "text-custom-red";
        case OrderStatus.DELIVERED:
            return "text-custom-green"
    }
}

export const convertDateTime = (dateString: string) => {
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

const round = (value: number, precision: number = 0) => {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
  }
  
export const formatAmount = (amt: number) => {
    return round(amt, 2);
}

export const formattedPrice =  (price: number) => {
  const formattedPrice = price.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'INR'
  });
  return formattedPrice
}
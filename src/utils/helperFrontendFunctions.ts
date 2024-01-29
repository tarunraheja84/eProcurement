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

export const prevBackButtonColors=(Page:number, totalPages:number)=>{
    const prevButton = document.getElementById("prevButton");
        const nextButton = document.getElementById("nextButton");

        //prevButton Color
        if (Page === 1) {
            prevButton?.classList.remove("bg-custom-red", "text-white");
            prevButton?.classList.add("bg-custom-gray-3", "text-black");
        }
        else {
            prevButton?.classList.remove("bg-custom-gray-3", "text-black");
            prevButton?.classList.add("bg-custom-red", "text-white");
        }
       
        //nextButton Color
        if (Page === totalPages) {
            nextButton?.classList.remove("bg-custom-red", "text-white");
            nextButton?.classList.add("bg-custom-gray-3", "text-black");
        }  
        else{
            nextButton?.classList.remove("bg-custom-gray-3", "text-black");
            nextButton?.classList.add("bg-custom-red", "text-white");
        } 
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
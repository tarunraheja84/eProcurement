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
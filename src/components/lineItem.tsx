import { QuotationProduct } from '@/types/quotationProduct';
import React, { useEffect, useState } from 'react'
import { Product } from '@/types/product'
import Image from "next/image";
import { Button } from 'primereact/button';
import { Order, OrderItem } from '@/types/order';
import { formatAmount } from './helperFunctions';

interface LineItemComponentProps {
  purchaseOrder: Order,
  lineItem: OrderItem,
  setPurchaseOrder: React.Dispatch<React.SetStateAction<Order>>
}
const LineItem: React.FC<LineItemComponentProps> = ({ lineItem, purchaseOrder, setPurchaseOrder }) => {
  const [count, setCount] = useState<number>(lineItem.orderedQty);
  const [inputCount, setInputCount] = useState(count);
  const [itemTotalAmount, setItemTotalAmount] = useState<number>(formatAmount(lineItem.unitPrice * lineItem.orderedQty))
  const [igst, cgst, sgst, cess] = lineItem.taxes ? [lineItem.taxes.igst ?? 0, lineItem.taxes.cgst ?? 0, lineItem.taxes.sgst ?? 0, lineItem.taxes.cess ?? 0] : [0,0,0,0]
  const [itemTotalTaxRate, setItemTotalTaxRate] = useState<number>(igst ? igst + cess : cgst + sgst + cess);
  const productId = lineItem.productId
  const handleIncrease = () => {
    const qty = count + 1;
    setCount(qty);
    const updatedOrderItems = purchaseOrder.orderItems.map(orderItem => {
      if (orderItem.productId === productId) {
        return {
          ...orderItem,
          orderedQty: qty,
          totalAmount: itemTotalAmount,
          totalTax: formatAmount(itemTotalAmount * itemTotalTaxRate / 100),
          total: formatAmount(itemTotalAmount + itemTotalAmount * itemTotalTaxRate / 100)
        };
      }
      return orderItem;
    });
    setPurchaseOrder({
      ...purchaseOrder,
      totalAmount: formatAmount(purchaseOrder.totalAmount + lineItem.unitPrice),
      total: formatAmount(purchaseOrder.total + lineItem.unitPrice + (lineItem.unitPrice * itemTotalTaxRate / 100)),
      totalTax: formatAmount(purchaseOrder.totalTax + (lineItem.unitPrice * itemTotalTaxRate / 100)),
      orderItems: updatedOrderItems
    })
  };

  const handleDecrease = () => {
    const qty = count - 1;
    if (qty === 0) {
      handleDeleteLineItem()
      return;
    }
    setCount(qty);
    const updatedOrderItems = purchaseOrder.orderItems.map(orderItem => {
      if (orderItem.productId === productId) {
        return {
          ...orderItem,
          orderedQty: qty,
          totalAmount: itemTotalAmount,
          totalTax: formatAmount(itemTotalAmount * itemTotalTaxRate / 100),
          total: formatAmount(itemTotalAmount + itemTotalAmount * itemTotalTaxRate / 100)
        };
      }
      return orderItem;
    });
    setPurchaseOrder({
      ...purchaseOrder,
      totalAmount: formatAmount(purchaseOrder.totalAmount - lineItem.unitPrice),
      total: formatAmount(purchaseOrder.total - lineItem.unitPrice - (lineItem.unitPrice * itemTotalTaxRate / 100)),
      totalTax: formatAmount(purchaseOrder.totalTax - (lineItem.unitPrice * itemTotalTaxRate / 100)),
      orderItems: updatedOrderItems
    })
  };

  const handleInputChange = (event: any) => {
    const qty = Number(event.target.value)
    setInputCount(qty);
    setCount(inputCount);
    let [totalAmount, totalTax, total] = [0, 0, 0];
    purchaseOrder.orderItems.map((orderItem: OrderItem) => {
      const taxes = orderItem.taxes;
      const [igst, cgst, sgst, cess] = taxes ? [taxes!.igst ?? 0, taxes!.cgst ?? 0, taxes!.sgst ?? 0, taxes!.cess ?? 0] : [0,0,0,0]
      const itemTotalTaxRate = (igst ? igst + cess : cgst + sgst + cess);
      if (orderItem.productId === productId) {
        totalAmount = formatAmount(totalAmount + (orderItem.unitPrice * qty));
        totalTax = formatAmount(totalTax + (orderItem.unitPrice * qty * itemTotalTaxRate / 100));
        total = formatAmount(totalAmount + totalTax);
      } else {
        totalAmount = formatAmount(totalAmount + (orderItem.unitPrice * orderItem.orderedQty));
        totalTax = formatAmount(totalTax + (orderItem.unitPrice * orderItem.orderedQty * itemTotalTaxRate / 100));
        total = formatAmount(totalAmount + totalTax);
      }
    });

    const updatedOrderItems = purchaseOrder.orderItems.map(orderItem => {
      if (orderItem.productId === productId) {
        return {
          ...orderItem,
          orderedQty: qty,
          totalAmount: formatAmount(lineItem.unitPrice * qty),
          totalTax: formatAmount(lineItem.unitPrice * qty * itemTotalTaxRate / 100),
          total: formatAmount(lineItem.unitPrice * qty + lineItem.unitPrice * qty * itemTotalTaxRate / 100)
        };
      }
      return orderItem;
    });
    setPurchaseOrder({
      ...purchaseOrder,
      totalAmount: totalAmount,
      total: total,
      totalTax: totalTax,
      orderItems: updatedOrderItems
    })
  };

  const handleDeleteLineItem = () => {
    const updatedOrderItems = purchaseOrder.orderItems.filter(item => item.productId !== productId);
    let [totalAmount, totalTax, total] = [0, 0, 0];
    updatedOrderItems.map(orderItem => {
      const taxes = orderItem?.taxes
      const [igst, cgst, sgst, cess] = [taxes!.igst ?? 0, taxes!.cgst ?? 0, taxes!.sgst ?? 0, taxes!.cess ?? 0]
      const itemTotalTaxRate = (igst ? igst + cess : cgst + sgst + cess);
      const unitPrice = orderItem.unitPrice ?? 0
      totalAmount = formatAmount(totalAmount + (unitPrice * orderItem.orderedQty))
      totalTax = formatAmount(totalTax + (unitPrice * orderItem.orderedQty * itemTotalTaxRate / 100))
      total = formatAmount(totalAmount + totalTax)
    });
    setPurchaseOrder({
      ...purchaseOrder,
      orderItems: updatedOrderItems,
      totalAmount: totalAmount,
      totalTax: totalTax,
      total: total,
    })

  }

  return (
    <>
      <div className="flex flex-row p-4 border-b-2 border-500 justify-between relative" key={lineItem.productId}>

        <div className='flex flex-row'>

          <Image
            src={lineItem.product?.imgPath ?? ""}
            alt={lineItem.product?.productName ?? ""}
            width={100}
            height={100}
          />
          <div className="ml-4 flex flex-col gap-[5px]">
            <h4 className="text-lg font-medium">{lineItem.product?.productName}</h4>
            <h4 className="text-lg font-medium">{lineItem.product?.packSize}</h4>
            <div className='flex gap-[10px] items-center'>
              <Button
                onClick={handleDecrease}
                className="mr-2 border-2 border-custom-red w-[30%] justify-center"
              >
                -
              </Button>
              <input
                type="text"
                defaultValue={count}
                onChange={handleInputChange}
                className='border-2 border-custom-red solid w-16 text-center'
              />
              <Button
                onClick={handleIncrease}
                className="mr-2 border-2 border-custom-red w-[30%] justify-center"
              >
                +
              </Button>
              <span>X</span>
              <p className="text-base font-regular">{lineItem.product?.sellingPrice} ₹/unit</p>
            </div>
          </div>

        </div>
        <div>
          <h5 className="text-base font-medium">Total Item Price : ₹ <span className='text-green-500'>{itemTotalAmount}</span></h5>
          {itemTotalTaxRate != 0 && <h5 className="text-base font-medium">Tax Amount : ₹ <span className='text-green-500'> {`${itemTotalAmount * itemTotalTaxRate / 100} (${itemTotalTaxRate}% gstRate)`} </span></h5>}
          {/* <h5 className="text-base font-medium">Total Price with Tax : ₹ <span className='text-green-500'> {itemTotalAmount + itemTotalAmount * itemTotalTaxRate / 100}</span></h5> */}
        </div>
        <i className="pi pi-delete-left absolute right-[0] top-[0] text-custom-red cursor-pointer" onClick={handleDeleteLineItem}></i>
      </div>
    </>

  )
}

export default LineItem
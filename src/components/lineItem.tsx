import React, { useEffect, useState } from 'react'
import { Product } from '@/types/product'
import Image from "next/image";
import { Button } from 'primereact/button';
import { Order, OrderItem } from '@/types/order';
import { formatAmount } from './helperFunctions';
import { Checkbox } from "primereact/checkbox";
import { Tag } from 'primereact/tag';
interface LineItemComponentProps {
  purchaseOrder: Order,
  lineItem: OrderItem,
  setPurchaseOrder: React.Dispatch<React.SetStateAction<Order>>,
  sellerProductIds : string[],
  productMap: Map<string, Product>,
  purchaseOrderProductIds : string[],

}
const LineItem: React.FC<LineItemComponentProps> = ({ lineItem, purchaseOrder, setPurchaseOrder , sellerProductIds, productMap, purchaseOrderProductIds}) => {
  const [checked, setChecked] = useState<boolean>(lineItem.isSellerOrderProduct && !lineItem.isAlreadyOrderedProduct ? true : false);
  const [itemTotalAmount, setItemTotalAmount] = useState<number>(formatAmount(lineItem.unitPrice * lineItem.orderedQty))
  const [igst, cgst, sgst, cess] = lineItem.taxes ? [lineItem.taxes.igst ?? 0, lineItem.taxes.cgst ?? 0, lineItem.taxes.sgst ?? 0, lineItem.taxes.cess ?? 0] : [0,0,0,0]
  const [itemTotalTaxRate, setItemTotalTaxRate] = useState<number>(igst ? igst + cess : cgst + sgst + cess);
  const productId = lineItem.id;
  const isSellerOrderProduct = sellerProductIds.includes(productMap.get(lineItem.id)?.productId ?? "")
  const isAlreadyOrderedProduct = purchaseOrderProductIds.includes(productId);

  const handleLineItemChange = (ischecked : boolean) => {
    let [totalAmount, totalTax, total] = [0, 0, 0];
    purchaseOrder.orderItems.map(orderItem => {
      if (orderItem.id === productId) orderItem.isSellerOrderProduct = ischecked;
      const isSellerOrderProduct = orderItem.isSellerOrderProduct;
      const isAlreadyOrderedProduct = orderItem.isAlreadyOrderedProduct;
      const taxes = orderItem?.taxes ? orderItem?.taxes : {};
      const [igst, cgst, sgst, cess] = [taxes!.igst ?? 0, taxes!.cgst ?? 0, taxes!.sgst ?? 0, taxes!.cess ?? 0]
      const itemTotalTaxRate = (igst ? igst + cess : cgst + sgst + cess);
      const unitPrice = orderItem.unitPrice ?? 0
      totalAmount = isSellerOrderProduct && !isAlreadyOrderedProduct ? formatAmount(totalAmount + (unitPrice * orderItem.orderedQty)) : totalAmount + 0;
      totalTax = isSellerOrderProduct && !isAlreadyOrderedProduct ? formatAmount(totalTax + (unitPrice * orderItem.orderedQty * itemTotalTaxRate / 100)) : totalTax + 0;
      total = isSellerOrderProduct && !isAlreadyOrderedProduct ? formatAmount(totalAmount + totalTax) : total + 0;
    });
    setPurchaseOrder({
      ...purchaseOrder,
      totalAmount: totalAmount,
      totalTax: totalTax,
      total: total,
    })
  }

  // Function to handle checkbox state change
  const handleCheckboxChange = () => {
    setChecked(!checked);
    handleLineItemChange(!checked) // Toggle the checkbox state
  };


  return (
    <>
      <div className={`flex flex-row p-4 border-b-2 border-500 justify-between relative ${!lineItem.isSellerOrderProduct || isAlreadyOrderedProduct ? "border bg-disable-grey" :""}`} key={lineItem.id}>

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
              <input
                type="text"
                defaultValue={lineItem.orderedQty}
                className={` solid w-16 text-center ${!isSellerOrderProduct  || isAlreadyOrderedProduct? "bg-disable-grey":""}`} //border-2 border-custom-red
                readOnly={true}
              />
              <span>X</span>
              <p className="text-base font-regular">{lineItem.product?.sellingPrice} ₹/unit</p>
            </div>
          </div>

        </div>
        <div>
          <h5 className="text-base font-medium">Total Item Price : ₹ <span className='text-green-500'>{itemTotalAmount}</span></h5>
          {itemTotalTaxRate != 0 && <h5 className="text-base font-medium">Tax Amount : ₹ <span className='text-green-500'> {`${itemTotalAmount * itemTotalTaxRate / 100} (${itemTotalTaxRate}% gstRate)`} </span></h5>}
        </div>
        <div className={`absolute left-[0] top-[0] text-custom-red ${ !isSellerOrderProduct || isAlreadyOrderedProduct ? "pointer-events-none" : ""} border-2 solid rounded-lg`}>
            <Checkbox onChange={handleCheckboxChange} checked={checked}></Checkbox>
        </div>
        { !isSellerOrderProduct && <div>
            <Tag className="mr-2 -rotate-45 absolute left-[0] top-[0] bg-custom-red m-[-30px] p-[4px] mt-[14px] text-[9px]" icon="pi pi-times" value={`"Not in Seller Order"`}></Tag>
        </div>}
        { isAlreadyOrderedProduct && <div>
            <Tag className="mr-2 -rotate-45 absolute left-[0] top-[0] bg-custom-red m-[-30px] p-[4px] mt-[14px] text-[9px]" icon="pi pi-exclamation-triangle" value={`"Already Order placed"`}></Tag>
        </div>}
      </div>
    </>

  )
}

export default LineItem
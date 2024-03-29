import React, { useState } from 'react'
import { Product } from '@/types/product'
import Image from "next/image";
import { Order, OrderItem } from '@/types/order';
import { Checkbox } from "primereact/checkbox";
import { Tag } from 'primereact/tag';
import { formatAmount } from '@/utils/helperFrontendFunctions';
interface LineItemComponentProps {
  purchaseOrder: Order,
  lineItem: OrderItem,
  setPurchaseOrder: React.Dispatch<React.SetStateAction<Order>>,
  sellerProductIds : string[],
  productMap: Map<string, Product>,
  purchaseOrderProductIds : string[]
  isDisabled? : boolean
}
const OrderLineItem: React.FC<LineItemComponentProps> = ({ lineItem, purchaseOrder, setPurchaseOrder , sellerProductIds, productMap, purchaseOrderProductIds}) => {
  const [checked, setChecked] = useState<boolean>(lineItem.isSellerOrderProduct && !lineItem.isAlreadyOrderedProduct ? true : false);
  const [igst, cgst, sgst, cess] = lineItem.taxes ? [lineItem.taxes.igst ?? 0, lineItem.taxes.cgst ?? 0, lineItem.taxes.sgst ?? 0, lineItem.taxes.cess ?? 0] : [0,0,0,0]

  const productId = lineItem.id;
  const isSellerOrderProduct = sellerProductIds.includes(productMap.get(lineItem.id)?.productId ?? "")
  const itemTotalAmount = formatAmount(lineItem.sellingPrice * lineItem.orderedQty);
  const isAlreadyOrderedProduct = purchaseOrderProductIds.includes(productId);
  const itemTotalTaxRate = igst ? igst + cess : cgst + sgst + cess;

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
      <div className={`flex flex-row p-4 border-b-2 justify-between relative ${!lineItem.isSellerOrderProduct || isAlreadyOrderedProduct ? "border bg-custom-gray-3" :""}`} key={lineItem.id}>

        <div className='flex flex-row'>

          <Image
            src={lineItem.imgPath ?? ""}
            alt={lineItem.productName ?? ""}
            width={100}
            height={100}
          />
          <div className="ml-4 flex flex-col gap-[5px]">
            <h4 className="text-lg font-medium">{lineItem.productName}</h4>
            <h4 className="text-lg font-medium">{lineItem.packSize}</h4>
            <div className='flex gap-[10px] items-center'>
              <span className='text-lg'>{lineItem.orderedQty}</span>
              <span>X</span>
              <p className="text-base font-regular">{lineItem.unitPrice} ₹/unit</p>
            </div>
          </div>

        </div>
        <div>
          <h5 className="text-base font-medium">Total Item Price : ₹ <span className='text-custom-green'>{itemTotalAmount}</span></h5>
          {itemTotalTaxRate != 0 && <h5 className="text-base font-medium">Tax Amount : ₹ <span className='text-custom-green'> {`${itemTotalAmount * itemTotalTaxRate / 100} (${itemTotalTaxRate}% gstRate)`} </span></h5>}
        </div>
        <div className={`absolute left-[0] top-[0] text-custom-theme ${ (!isSellerOrderProduct || isAlreadyOrderedProduct) ? "pointer-events-none" : "cursor-pointer"} border-2 solid rounded-lg`}>
            <Checkbox onChange={handleCheckboxChange} checked={checked}></Checkbox>
        </div>
        { !isSellerOrderProduct && <div>
            <Tag className="mr-2 -rotate-45 absolute left-[0] top-[0] bg-custom-theme m-[-30px] p-[4px] mt-[14px] text-[9px]" icon="pi pi-times" value={`Not in Quotation`}></Tag>
        </div>}
        { isAlreadyOrderedProduct && <div>
            <Tag className="mr-2 -rotate-45 absolute left-[0] top-[0] bg-custom-theme m-[-30px] p-[4px] mt-[14px] text-[9px]" icon="pi pi-exclamation-triangle" value={`Already Order placed`}></Tag>
        </div>}
      </div>
    </>

  )
}

export default OrderLineItem
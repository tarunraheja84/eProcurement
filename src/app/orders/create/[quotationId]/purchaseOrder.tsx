'use client'
import { Quotation } from '@/types/quotation'
import { QuotationProduct } from '@/types/quotationProduct'
import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Product } from '@/types/product'
import LineItem from '../../../../components/lineItem'
import { Order, OrderItem } from '@/types/order'
import { OrderStatus } from '@/types/enums'
import { DeliverAddress } from '@/types/deliveryAddress'
import { formatAmount } from '@/components/helperFunctions'
import axios from 'axios'

interface Props {
  quotation: Quotation
  productMap: Map<string, Product>
  deliveryAddress : DeliverAddress
}

const PurchaseOrder = (props: Props) => {
  const [expanded, setExpanded] = useState(false)
  const orderItems: OrderItem[] = []
  let [totalAmount, totalTax, total] = [0, 0, 0];
  props.quotation.quotationProducts.map((quotationProduct: QuotationProduct) => {
    const taxes = props.productMap.get(quotationProduct.productId)?.taxes
    const [igst, cgst, sgst, cess] = taxes ? [taxes!.igst ?? 0, taxes!.cgst ?? 0, taxes!.sgst ?? 0, taxes!.cess ?? 0] : [0,0,0,0]
    const itemTotalTaxRate = (igst ? igst + cess : cgst + sgst + cess);
    const sellingprice = props.productMap.get(quotationProduct.productId)?.sellingPrice ?? 0
    totalAmount = formatAmount(totalAmount + (sellingprice * quotationProduct.acceptedQty))
    totalTax = formatAmount(totalTax + (sellingprice * quotationProduct.acceptedQty * itemTotalTaxRate / 100))
    total = formatAmount(totalAmount + totalTax)
    orderItems.push({
      productId: quotationProduct.productId,
      product: props.productMap.get(quotationProduct.productId),
      orderedQty: quotationProduct.acceptedQty,
      totalAmount: formatAmount(quotationProduct.acceptedQty * sellingprice),
      totalTax: formatAmount(sellingprice * quotationProduct.acceptedQty * itemTotalTaxRate / 100),
      total: formatAmount(quotationProduct.acceptedQty * sellingprice + sellingprice * quotationProduct.acceptedQty * itemTotalTaxRate / 100),
      receivedQty: 0,
      unitPrice: sellingprice,
      ...(taxes && { taxes: props.productMap.get(quotationProduct.productId)?.taxes })
    })
  })
  const [purchaseOrder, setPurchaseOrder] = useState<Order>({
    createdAt: new Date(),
    createdBy: "",
    updatedAt: new Date(),
    updatedBy: "",
    status: OrderStatus.PENDING,
    totalAmount: totalAmount,
    totalTax: totalTax,
    total: total,
    vendorId: props.quotation.vendorId,
    deliveryAddress: `${props.deliveryAddress.addressLine1,props.deliveryAddress.addressLine2,props.deliveryAddress.city,props.deliveryAddress.state,props.deliveryAddress.pincode}`,
    quotationId: props.quotation.quotationId,
    orderItems: orderItems
  })

  const handlePlaceOrder = async () => {
    purchaseOrder.orderItems.map((items: OrderItem) => {
      delete items.product
    });
    await axios.post("/api/order/create_order", purchaseOrder)
    alert("order created successfully")
  }
  if (purchaseOrder.orderItems.length === 0) {
    return (
      <>
        NO ITEMS AVAILABLE
      </>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center pb-4 sticky top-[0] z-[99] p-[1rem] bg-slate-200 border-4 shadow-lg">
        <span>Purchase Order</span>
        <div>
          <div className="text-xl font-bold float-right">Total Amount to Pay: ₹ <span className='text-green-500'>{purchaseOrder.total}</span></div>
        </div>
        <Button className="bg-custom-red px-5 py-3 text-white shadow-lg" onClick={handlePlaceOrder}>Place Order</Button>
      </div>
      <hr />
      <div className="flex flex-col">
        <div className="flex flex-col mt-4 items-center">
          <div className='flex items-center'>
            <div className="text-lg font-medium">Quotation ID: </div>
            <span>{props.quotation.quotationId}</span>
          </div>
          <div className='flex items-center'>
            <div className="text-lg font-medium">Expt. Delivery Date: </div>
            <span>{new Date().toDateString()}</span>
          </div>
          <div className='flex items-center'>
            <div className="text-lg font-medium">Vendor: </div>
            <span>{props.quotation.vendor.businessName}</span>
          </div>

        </div>
        <div className="flex flex-col mt-4 border-2 border-600 drop-shadow-md">
          {purchaseOrder.orderItems.map((lineItem: OrderItem) => (
            <LineItem key={Math.random() + "" + new Date()} lineItem={lineItem} purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} />
          ))}
        </div>

        <div className="flex flex-row mt-4 justify-between" >
          <div className="mt-4">
            <h3 className="text-lg font-medium">Delivery Address</h3>
            <div className="flex flex-col">
              <p className="text-base font-regular">{props.deliveryAddress.addressLine1}</p>
              <p className="text-base font-regular">{props.deliveryAddress.addressLine2} , {props.deliveryAddress.city}</p>
              <p className="text-base font-regular">{props.deliveryAddress.state} , {props.deliveryAddress.pincode}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-medium">Subtotal: ₹ <span className='text-green-500'> {purchaseOrder.totalAmount}</span></div>
            <div className="text-lg font-medium">Total Tax: ₹ <span className='text-green-500'>{purchaseOrder.totalTax}</span></div>
            <hr className='h-1 bg-gray-100 border-0 rounded bg-black' />
            <div className="text-lg font-bold">Total Amount: ₹ <span className='text-green-500'>{purchaseOrder.total}</span></div>
          </div>

        </div>
      </div>
    </>
  )
}

export default PurchaseOrder

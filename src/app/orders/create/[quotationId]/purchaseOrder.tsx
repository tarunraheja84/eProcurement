'use client'
import { Quotation } from '@/types/quotation'
import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Product } from '@/types/product'
import LineItem from '../../../../components/lineItem'
import { Order, OrderItem } from '@/types/order'
import { OrderStatus } from '@/types/enums'
import { DeliverAddress } from '@/types/deliveryAddress'
import { formatAmount } from '@/components/helperFunctions'
import axios from 'axios'
import { SellerOrder, SellerOrderDetails } from '@/types/sellerOrder'
import Link from 'next/link'
interface Props {
  quotation: Quotation
  productMap: Map<string, Product>
  deliveryAddress: DeliverAddress
  quotationProductsDetails: Map<string, QuotationProductsDetails>
}
interface QuotationProductsDetails {
  supplierPrice: number,
  requestedQty: number,
  acceptedQty: number,
}

const PurchaseOrder = (props: Props) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isValidOrder, setIsValidOrder] = useState(false);
  const [sellerOrderId, setSellerOrderId] = useState<string>("");
  const [sellerProductIds, setSellerProductIds] = useState<string[]>(['']);
  const [isNotRedbasilSeller, setIsNotRedbasilSeller] = useState<boolean>(false);
  const [orderUrl, setOrderUrl] = useState<string | null>(null);
  const [purchaseOrderProductIds, setPurchaseOrderProductIds] = useState<string[]>(['']);
  const openPopup = () => {
    setPopupOpen(true);
  };
  const handleSellerOrderIdInput = (event: any) => {
    const sellerOrderId = (event.target.value);
    setSellerOrderId(sellerOrderId);
    setIsValidOrder(false);
  };
  const onClickVerifyOrder = async () => {
    if (sellerOrderId.trim().length === 0) { alert("Please enter Seller Order Id"); return }
    try {
      const results: any = await axios.post('/api/orders/get_seller_orders', { sellerOrderId })
      const sellerOrders: SellerOrder[] = results.data.sellerOrders
      if (sellerOrders.length === 0) {
        setIsNotRedbasilSeller(true)
        setIsValidOrder(false)
      } else {
        console.log('sellerOrders[0].sellerId :>> ', sellerOrders[0].buyerOrderId);
        if (sellerOrders[0].sellerId != process.env.NEXT_PUBLIC_SELLER_ID) {
          setIsNotRedbasilSeller(true)
          setIsValidOrder(false)
          return;
        }
        let sellerProdIds: string[] = []
        sellerOrders[0].orderItems.map((orderItem: SellerOrderDetails) => {
          sellerProdIds.push(orderItem.productId);
        });
        setSellerProductIds(sellerProdIds)
        setIsNotRedbasilSeller(false)
        setIsValidOrder(true)
        setOrderUrl(`https://flavr-fb.el.r.appspot.com/orders/${sellerOrders[0].buyerOrderId}/view#${sellerOrders[0].sellerOrderId}`)
      }
      return;
    } catch (error: any) {
      console.log(error);
      alert(`Please Try Again : ${error.message}`)
      return;
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
  };
  const PopupDialog = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg border-4 shadow-lg">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          {isNotRedbasilSeller ? <p className="text-gray-600 my-4 text-red-600">
            Error :* This order placement is exclusive to Flavr Foods seller.
          </p> :
            orderUrl && <div><Link href={`${orderUrl}`} target='_blank' className='text-xs flex text-blue-600 justify-center underline'>View Marketplace Order</Link></div>
          }
          <h2 className="text-2xl font-semibold text-gray-800">Order Selection</h2>
          <p className="text-gray-600 mb-4 text-xs">
            Identify the sellerorder for which you wish to place an order.*
          </p>
          <label htmlFor="sellerOrderId"> SellerOrderId : </label>
          <input
            name='sellerOrderId'
            type="text"
            defaultValue={sellerOrderId}
            onChange={handleSellerOrderIdInput}
            className='border-2 border-custom-red solid w-60 text-center rounded'
          />
          <div className='flex justify-between'>
            {isValidOrder ? <button
              onClick={closePopup}
              className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Continue
            </button> :
              <button
                onClick={onClickVerifyOrder}
                className="mt-6 px-4 py-2 bg-custom-red text-white rounded-md hover:bg-red-600"
              >
                Create Purchase Order
              </button>
            }
          </div>
        </div>
      </div>
    );
  };

  const [purchaseOrder, setPurchaseOrder] = useState<Order>({
    createdAt: new Date(),
    createdBy: "",
    updatedAt: new Date(),
    updatedBy: "",
    status: OrderStatus.PENDING,
    totalAmount: 0,
    totalTax: 0,
    total: 0,
    vendorId: props.quotation.vendorId,
    deliveryAddress: `${props.deliveryAddress.addressLine1}, ${props.deliveryAddress.addressLine2}, ${props.deliveryAddress.city}, ${props.deliveryAddress.state}, ${props.deliveryAddress.pincode}`,
    quotationId: props.quotation.quotationId!,
    orderItems: [],
    marketPlaceOrderId: sellerOrderId,
    marketPlaceOrderUrl: orderUrl ?? "",
  })

  const calculateTotals = () => {
    let orderItems: OrderItem[] = []
    let [totalAmount, totalTax, total] = [0, 0, 0];
    props.quotation.products!.map((prod: Product) => {
      const isSellerOrderProduct = sellerProductIds.includes(props.productMap.get(prod.id!)!.productId)
      const isAlreadyOrderedProduct = purchaseOrderProductIds.includes(prod.id!)
      const taxes = props.productMap.get(prod.id!)?.taxes
      const [igst, cgst, sgst, cess] = taxes ? [taxes!.igst ?? 0, taxes!.cgst ?? 0, taxes!.sgst ?? 0, taxes!.cess ?? 0] : [0, 0, 0, 0]
      const itemTotalTaxRate = (igst ? igst + cess : cgst + sgst + cess);
      const sellingprice = props.quotationProductsDetails.get(prod.id!)!.supplierPrice;
      totalAmount = isSellerOrderProduct && !isAlreadyOrderedProduct ? formatAmount(totalAmount + (sellingprice * props.quotationProductsDetails.get(prod.id!)!.acceptedQty)) : totalAmount + 0;
      totalTax = isSellerOrderProduct && !isAlreadyOrderedProduct ? formatAmount(totalTax + (sellingprice * props.quotationProductsDetails.get(prod.id!)!.acceptedQty * itemTotalTaxRate / 100)) : totalTax + 0;
      total = isSellerOrderProduct && !isAlreadyOrderedProduct ? formatAmount(totalAmount + totalTax) : total + 0;
      orderItems.push({
        id: prod.id!,
        product: prod!,
        orderedQty: props.quotationProductsDetails.get(prod.id!)!.acceptedQty,
        totalAmount: formatAmount(props.quotationProductsDetails.get(prod.id!)!.acceptedQty * sellingprice),
        totalTax: formatAmount(sellingprice * props.quotationProductsDetails.get(prod.id!)!.acceptedQty * itemTotalTaxRate / 100),
        total: formatAmount(props.quotationProductsDetails.get(prod.id!)!.acceptedQty * sellingprice + sellingprice * props.quotationProductsDetails.get(prod.id!)!.acceptedQty * itemTotalTaxRate / 100),
        receivedQty: 0,
        unitPrice: sellingprice,
        isSellerOrderProduct: isSellerOrderProduct,
        isAlreadyOrderedProduct: isAlreadyOrderedProduct,
        productId: prod.productId,
        productName: prod.productName,
        category: prod.category,
        categoryId: prod.categoryId,
        subCategory: prod.subCategory,
        subCategoryId: prod.subCategoryId,
        imgPath: prod.imgPath,
        sellingPrice: prod.sellingPrice,
        packSize: prod.packSize,
        acceptedQty: 0,
        isSellerAccepted: true,
        ...(taxes && { taxes: props.productMap.get(prod.id!)?.taxes })
      })
    })
    setPurchaseOrder({ ...purchaseOrder, total, totalAmount, totalTax, orderItems });
  }

  const handlePlaceOrder = async () => {
    purchaseOrder.orderItems = purchaseOrder.orderItems
      .filter((items) => items.isSellerOrderProduct)
      .map((items) => {
        delete items.product;
        delete items.isSellerOrderProduct;
        delete items.isAlreadyOrderedProduct;
        return items;
      });
    purchaseOrder.marketPlaceOrderId = sellerOrderId;
    purchaseOrder.marketPlaceOrderUrl = orderUrl ?? "";
    await axios.post("/api/orders/create_order", purchaseOrder)
    alert("order created successfully")
  }

  const getPurchaseOrders = async () => {
    const results: any = await axios.post('/api/orders/get_purchase_orders', { sellerOrderId })
    const purOrders: Order[] = results.data.purchaseOrders;
    const productIds: string[] = [];
    purOrders.map((order: Order) => {
      order.orderItems.map((orderItem: OrderItem) => {
        purchaseOrderProductIds.push(orderItem.productId)
        productIds.push(orderItem.id)
      })
    })
    setPurchaseOrderProductIds(productIds)
  }

  useEffect(() => {
    openPopup();
  }, [])

  useEffect(() => {
    if (isValidOrder) getPurchaseOrders();
  }, [isValidOrder])

  useEffect(() => {
    if (isPopupOpen) return;
    else {
      calculateTotals();
    }
  }, [isPopupOpen])

  return (
    <>
      <PopupDialog isOpen={isPopupOpen} onClose={closePopup} />

      {isValidOrder && !isPopupOpen && <div>

        <div className={`flex justify-between items-center pb-4 sticky top-[0] z-[99] p-[1rem] bg-slate-200 border-4 shadow-lg`}>
          <span>Purchase Order</span>
          <div>
            <div className="text-xl font-bold float-right">Total Amount to Pay: ₹ <span className='text-green-500'>{purchaseOrder.total}</span></div>
          </div>
          <Button className={`bg-custom-red px-5 py-3 text-white shadow-lg ${purchaseOrder.total <= 0 ? "bg-disable-grey pointer-events-none" : ""}`} onClick={handlePlaceOrder}>Place Order</Button>
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
              <span>{props.quotation.vendor!.businessName}</span>
            </div>

          </div>
          <div className="flex flex-col mt-4 border-2 border-600 drop-shadow-md">
            {purchaseOrder && purchaseOrder.orderItems.map((lineItem: OrderItem) => (
              <LineItem key={Math.random() + "" + new Date()} lineItem={lineItem} purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} sellerProductIds={sellerProductIds} productMap={props.productMap} purchaseOrderProductIds={purchaseOrderProductIds} />
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
      </div>
      }

    </>
  )
}

export default PurchaseOrder

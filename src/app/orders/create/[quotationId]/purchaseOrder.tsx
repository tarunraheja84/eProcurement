'use client'
import { Quotation } from '@/types/quotation'
import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Product, Taxes } from '@/types/product'
import OrderLineItem from '@/components/orders/OrderLineItem'
import axios from 'axios'
import { DeliveryAddressMap, SellerOrder, SellerOrderItems } from '@/types/sellerOrder'
import Link from 'next/link'
import { formatAmount, getTaxRates } from '@/utils/helperFrontendFunctions'
import { BuyerDetails, Order, OrderItem } from '@/types/order'
import { OrderStatus, PaymentType } from '@prisma/client'
import { Buyer } from '@/types/buyer'
import GSTStateCodes from '@/utils/gst-state-codes';
import Loading from '@/app/loading'

interface Props {
  quotation: Quotation
  productMap: Map<string, Product>
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
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddressMap>({
    addressLine: "",
    city: "",
    country: "",
    pinCode: "",
    state: "",
  })
  const [sellerProductIds, setSellerProductIds] = useState<string[]>(['']);
  const [isNotRedbasilSeller, setIsNotRedbasilSeller] = useState<boolean>(false);
  const [orderUrl, setOrderUrl] = useState<string | null>(null);
  const [purchaseOrderProductIds, setPurchaseOrderProductIds] = useState<string[]>(['']);
  const [marketPlaceProdIdProdMap, setMarketPlaceProdIdProdMap] = useState<Map<string, SellerOrderItems> | null>(null);
  const [productsNotInQuotation, setProductsNotInQuotation] = useState<OrderItem[]>([]);

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
    setLoading(true);
    try {
      const results: any = await axios.get('/api/orders/get_seller_orders', { params: { sellerOrderId } })
      const sellerOrders: SellerOrder[] = results.data.sellerOrders
      if (sellerOrders.length === 0) {
        setIsNotRedbasilSeller(true)
        setIsValidOrder(false)
      } else {
        if (sellerOrders[0].sellerId != process.env.NEXT_PUBLIC_SELLER_ID) {
          setIsNotRedbasilSeller(true)
          setIsValidOrder(false)
          return;
        }
        const buyerId = sellerOrders[0].buyerId
        const result = await axios.get("/api/get_marketplace_buyer", { params: { buyerId } })
        const buyerDetails: Buyer = result.data.buyer;
        let sellerProdIds: string[] = []
        let mPlaceProdIdOrderQuantityMap = new Map<string, SellerOrderItems>();
        sellerOrders[0].orderItems.map((orderItem: SellerOrderItems) => {
          sellerProdIds.push(orderItem.productId);
          mPlaceProdIdOrderQuantityMap.set(orderItem.productId, orderItem)
        });
        const buyer: BuyerDetails = {
          buyerBusinessName: buyerDetails.businessName,
          buyerBizBrandName: buyerDetails.businessBrandName,
          billingAddress: `${buyerDetails.addrL1}, ${buyerDetails.addrL2}, ${buyerDetails.city}, ${buyerDetails.state}, ${buyerDetails.pinCode}`,
          billingAddrStateUTCode: GSTStateCodes[buyerDetails.state.toLocaleUpperCase() as keyof typeof GSTStateCodes],
          shippingAddrStateUTCode: GSTStateCodes[sellerOrders[0].deliveryAddressMap!.state.toLocaleUpperCase() as keyof typeof GSTStateCodes],
        }
        if (buyerDetails.gstin) buyer.buyerGSTIN = buyerDetails.gstin

        setPurchaseOrder({ ...purchaseOrder, buyerDetails: buyer })
        setMarketPlaceProdIdProdMap(mPlaceProdIdOrderQuantityMap)
        setSellerProductIds(sellerProdIds)
        setIsNotRedbasilSeller(false)
        setIsValidOrder(true)
        setDeliveryAddress(sellerOrders[0].deliveryAddressMap!)
        setOrderUrl(`${process.env.NEXT_PUBLIC_MARKETPLACE_BASE_URL}orders/${sellerOrders[0].buyerOrderId}/view#${sellerOrders[0].sellerOrderId}`)
      }
    } catch (error: any) {
      console.log('error  :>> ', error);
      setLoading(false);
      alert(`Some Error Occured. Please Try Again`)
      return;
    }
    setLoading(false);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const [purchaseOrder, setPurchaseOrder] = useState<Order>({
    createdAt: new Date(),
    createdBy: "",
    updatedAt: new Date(),
    updatedBy: "",
    status: OrderStatus.PENDING,
    isVendorInvoicePresent: false,
    totalAmount: 0,
    totalTax: 0,
    total: 0,
    vendorId: props.quotation.vendorId,
    deliveryAddress: deliveryAddress,
    quotationId: props.quotation.quotationId!,
    orderItems: [],
    marketPlaceOrderId: sellerOrderId,
    marketPlaceOrderUrl: orderUrl ?? "",
    finalTotal: 0,
    finalTotalAmount: 0,
    finalTotalTax: 0,
    sellerDetails: {
      sellerBusinessName: '',
      sellerBusinessAddress: '',
      sellerPhoneNo: '',
      sellerBizBrandName: '',
      sellerGSTIN: '',
      sellerPAN: ''
    },
    buyerDetails: {
      buyerBusinessName: '',
      buyerBizBrandName: '',
      billingAddress: '',
      billingAddrStateUTCode: '',
      shippingAddrStateUTCode: '',
      buyerGSTIN: ''
    }
  })

  const calculateTotals = () => {
    let orderItems: OrderItem[] = []
    let productsInPurchaseOrderItems: string[] = []
    let [totalAmount, totalTax, total] = [0, 0, 0];
    props.quotation.products!.map((prod: Product) => {
      const sellingprice = props.quotationProductsDetails.get(prod.id!)!.supplierPrice;
      const acceptedQty = props.quotationProductsDetails.get(prod.id!)!.acceptedQty;
      if ((sellingprice * acceptedQty) === 0) return; // check wheather the vendor accepted product or not 
      const isSellerOrderProduct = sellerProductIds.includes(props.productMap.get(prod.id!)!.productId) // check if the quotation item is present in sellerOrder items
      const sellerOrderProduct = marketPlaceProdIdProdMap!.get(prod.productId)
      const sellerProductId = sellerOrderProduct?.sellerProductId;
      const orderQty = sellerOrderProduct?.orderedQuantity || 0
      const isAlreadyOrderedProduct = purchaseOrderProductIds.includes(prod.id!) // check if product already ordered with other purchase order
      const taxes = productIdTaxMap!.get(prod.productId)
      const [igst, cgst, sgst, cess] = taxes ? [taxes!.igst ?? 0, taxes!.cgst ?? 0, taxes!.sgst ?? 0, taxes!.cess ?? 0] : [0, 0, 0, 0]
      const itemTotalTaxRate = (igst ? igst + cess : cgst + sgst + cess);
      totalAmount = isSellerOrderProduct && !isAlreadyOrderedProduct ? formatAmount(totalAmount + (sellingprice * orderQty)) : totalAmount + 0;
      totalTax = isSellerOrderProduct && !isAlreadyOrderedProduct ? formatAmount(totalTax + (sellingprice * orderQty * itemTotalTaxRate / 100)) : totalTax + 0;
      total = isSellerOrderProduct && !isAlreadyOrderedProduct ? formatAmount(totalAmount + totalTax) : total + 0;
      if (isSellerOrderProduct) {
        productsInPurchaseOrderItems.push(prod.productId);
        orderItems.push({
          id: prod.id!,
          orderedQty: orderQty,
          sellerProductId: sellerProductId!,
          totalAmount: formatAmount(orderQty * sellingprice),
          totalTax: formatAmount(sellingprice * orderQty * itemTotalTaxRate / 100),
          total: formatAmount(orderQty * sellingprice + sellingprice * orderQty * itemTotalTaxRate / 100),
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
          sellingPrice: sellingprice,
          packSize: prod.packSize,
          acceptedQty: 0,
          isSellerAccepted: true,
          ...(taxes && { taxes: props.productMap.get(prod.id!)?.taxes })
        })
      }
    })
    setPurchaseOrder({ ...purchaseOrder, total, totalAmount, totalTax, orderItems, deliveryAddress });
    let itemsNotInQuotation: OrderItem[] = []
    Array.from(marketPlaceProdIdProdMap!.values()!).map((item: SellerOrderItems) => { // itration for that sellerorder items which are not present in quotation
      if (productsInPurchaseOrderItems.includes(item.productId)) return;
      itemsNotInQuotation.push({
        id: "",
        orderedQty: item.orderedQuantity,
        sellerProductId: item.sellerProductId!,
        totalAmount: 0,
        totalTax: 0,
        total: 0,
        receivedQty: 0,
        unitPrice: item.unitPrice,
        isSellerOrderProduct: false,
        isAlreadyOrderedProduct: false,
        productId: item.productId,
        productName: item.productName,
        category: item.categoryName,
        categoryId: item.categoryId,
        subCategory: item.subcategoryName,
        subCategoryId: item.subcategoryId,
        imgPath: "",
        sellingPrice: item.unitPrice,
        packSize: item.packSize,
        acceptedQty: item.acceptedQuantity!,
        isSellerAccepted: true,
      })
    })
    setProductsNotInQuotation(itemsNotInQuotation)
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    purchaseOrder.orderItems = purchaseOrder.orderItems
      .filter((items) => items.isSellerOrderProduct && !items.isAlreadyOrderedProduct)
      .map((items) => {
        delete items.isSellerOrderProduct;
        delete items.isAlreadyOrderedProduct;
        return items;
      });
    purchaseOrder.marketPlaceOrderId = sellerOrderId;
    purchaseOrder.marketPlaceOrderUrl = orderUrl ?? "";
    purchaseOrder.paymentType = PaymentType.NONE;
    await axios.post("/api/orders/create_order", purchaseOrder)
    setLoading(false);
    alert("order created successfully")
    window.open("/orders", "_self");
  }

  const getPurchaseOrders = async () => {
    const results: any = await axios.get('/api/orders/get_purchase_orders', { params: { sellerOrderId } });
    const purOrders: Order[] = results.data.purchaseOrders;
    const productIds: string[] = [];
    if (purOrders && purOrders.length > 0) {
      purOrders.map((order: Order) => {
        order.orderItems.map((orderItem: OrderItem) => {
          purchaseOrderProductIds.push(orderItem.productId)
          productIds.push(orderItem.id)
        })
      })
    }
    setPurchaseOrderProductIds(productIds)
  }

  useEffect(() => {
    openPopup();
  }, [])

  useEffect(() => {
    if (isValidOrder) getPurchaseOrders();
  }, [isValidOrder])

  useEffect(() => {
    if (isPopupOpen || !isValidOrder) return;
    else {
      calculateTotals();
    }
  }, [isPopupOpen])

  const [productIdTaxMap, setProductIdTaxMap] = useState<Map<string, Taxes> | null>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const quotation = props.quotation;

  useEffect(() => {
    (async () => {
      const prodIdTaxMap = await getTaxRates(quotation.products!);
      setProductIdTaxMap(prodIdTaxMap);
    })();
  }, [])

  return (
    <>
      {isPopupOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg border-4 shadow-lg">
        {loading && <div className="absolute inset-0 z-10"><Loading /></div>}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          {isNotRedbasilSeller ? <p className="my-4 text-custom-red">
            Error :* This order placement is exclusive to Flavr Foods seller.
          </p> :
            <>
              {orderUrl && <div>
                <p className="my-4 text-custom-green">
                  Order verified. This is a valid order.
                </p>
                <Link href={`${orderUrl}`} target='_blank' className='text-xs flex text-custom-blue justify-center underline'>View Marketplace Order</Link>
              </div>}
            </>
          }
          <h2 className="text-2xl font-semibold text-custom-gray-5">Order Selection</h2>
          <p className="text-custom-gray-4 mb-4 text-xs">
            Identify the sellerorder for which you wish to place an order.*
          </p>
          <label htmlFor="sellerOrderId"> SellerOrderId : </label>
          <input
            name='sellerOrderId'
            type="text"
            defaultValue={sellerOrderId}
            onChange={handleSellerOrderIdInput}
            className='border-2 border-custom-theme solid w-60 rounded outline-none px-2'
          />
          <div className='flex justify-between'>
            {isValidOrder ? <button
              onClick={closePopup}
              className="mt-6 px-4 py-2 bg-custom-green text-custom-buttonText rounded-md hover:bg-hover-green"
            >
              Continue
            </button> :
              <button
                onClick={onClickVerifyOrder}
                className="mt-6 px-4 py-2 bg-custom-theme text-custom-buttonText rounded-md hover:bg-hover-theme"
              >
                Create Purchase Order
              </button>
            }
          </div>
        </div>
      </div> : <></>}

      {isValidOrder && !isPopupOpen && <div>
        {loading && <div className="absolute inset-0 z-10"><Loading /></div>}
        <div className={`flex justify-between items-center pb-4 sticky top-16 z-10 p-[1rem] bg-custom-gray-1 border-4 shadow-lg`}>
          <span>Purchase Order</span>
          <div>
            <div className="text-xl font-bold float-right">Total Amount to Pay: ₹ <span className='text-custom-green'>{purchaseOrder.total}</span></div>
          </div>
          <Button className={`bg-custom-theme hover:bg-hover-theme px-5 py-3 text-custom-buttonText shadow-lg ${purchaseOrder.total <= 0 ? "bg-custom-gray-3 pointer-events-none" : ""}`} onClick={handlePlaceOrder}>Place Order</Button>
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
          <div className="flex flex-col mt-4 border-2 drop-shadow-md">
            {purchaseOrder && marketPlaceProdIdProdMap && purchaseOrder.orderItems.map((lineItem: OrderItem, index: number) => (
              <OrderLineItem key={index} lineItem={lineItem} purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} sellerProductIds={sellerProductIds} productMap={props.productMap} purchaseOrderProductIds={purchaseOrderProductIds} />
            ))}
            {productsNotInQuotation && productsNotInQuotation.map((lineItem: OrderItem, index: number) => (
              <OrderLineItem key={index} lineItem={lineItem} purchaseOrder={purchaseOrder} setPurchaseOrder={setPurchaseOrder} sellerProductIds={sellerProductIds} productMap={props.productMap} purchaseOrderProductIds={purchaseOrderProductIds} isDisabled={true} />
            ))}
          </div>

          <div className="flex flex-row mt-4 justify-between" >
            <div className="mt-4">
              <h3 className="text-lg font-medium">Delivery Address</h3>
              <div className="flex flex-col">
                <p className="text-base font-regular">{deliveryAddress.addressLine}</p>
                <p className="text-base font-regular">{deliveryAddress.city}</p>
                <p className="text-base font-regular">{deliveryAddress.state} , {deliveryAddress.pinCode}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-lg font-medium">Subtotal: ₹ <span className='text-custom-green'> {purchaseOrder.totalAmount}</span></div>
              <div className="text-lg font-medium">Total Tax: ₹ <span className='text-custom-green'>{purchaseOrder.totalTax}</span></div>
              <hr className='h-1 border-0 rounded bg-black' />
              <div className="text-lg font-bold">Total Amount: ₹ <span className='text-custom-green'>{purchaseOrder.total}</span></div>
            </div>

          </div>
        </div>
      </div>
      }

    </>
  )
}

export default PurchaseOrder

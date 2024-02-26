'use client'
import AccessDenied from '@/app/access_denied/page';
import VendorOrderLineItem from '@/components/orders/vendorOrderLineItem';
import { Order, OrderItem } from '@/types/order';
import { usePermissions } from '@/utils/helperFrontendFunctions';
import { OrderStatus } from '@prisma/client';
import axios from 'axios';
import { headers } from 'next/headers';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
interface Props {
  order: Order,
  isViewOnly: boolean
}
const OrderClientComponent = (props: Props) => {
  const [order, setOrder] = useState<Order>({ ...props.order, finalTotal: props.order.total, finalTotalTax: props.order.totalTax, finalTotalAmount: props.order.totalAmount });
  const orderId = order.orderId
  const isViewOnly = props.isViewOnly
  const [orderAmount, setOrderAmount] = useState<number>(0)
  const [mismatchAmount, setMismatchAmount] = useState<boolean>(false);

  async function handleOrderUpdate(arg0: string): Promise<void> {
    if (arg0 === "ACCEPT") order.status = OrderStatus.CONFIRMED
    if (arg0 === "CANCEL") order.status = OrderStatus.CANCELLED

    delete order.orderId
    const orderDetails: any = Object.fromEntries(
      Object.entries(order).filter(([key, value]) => value !== null)
    )
    order.orderItems.map((lineItem: OrderItem) => {
      if (lineItem.isSellerAccepted) lineItem.acceptedQty = lineItem.orderedQty;
    })
    const result = await axios.put("/api/orders/update", { order: orderDetails, orderId })
    if (result.status === 201) {
      if (arg0 === "ACCEPT") alert("Order Accepted Successfully!")
      if (arg0 === "CANCEL") alert("Order Cancelled Successfully!")
    }
  }

  async function handleCancel(): Promise<void> {
    order.orderItems.map((lineItem: OrderItem) => {
      lineItem.isSellerAccepted = false;
      lineItem.acceptedQty = 0;
    })
    order.finalTotal = 0;
    order.finalTotalTax = 0;
    order.finalTotalAmount = 0;
    setOrder({ ...order });
    await handleOrderUpdate("CANCEL");
  }
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
  };
  const closePopup = () => {
    setPopupOpen(false);
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function updateSellerOrder() {
    order.isVendorInvoicePresent = true;
    delete order.orderId;
    try {
      await axios.post('/api/orders/update', { order, orderId })
    } catch (error) {
      console.log('error :>> ', error);
    }
  }

  async function downloadInvoiceFile() {
    const url = `${process.env.NEXT_PUBLIC_STORAGE_BUCKET_URL}${order.vendorId}/${order.orderId}.png`;
    try {
      const response = await axios({
        method: 'get',
        url,
        headers: {
        },
        responseType: 'blob', // Use 'blob' to handle binary data
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `redbasil_invoice_${orderId}`)
      link.download;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('File downloaded successfully!');
    } catch (error: any) {
      alert("Error on Downloading ...!")
      console.log('error :>> ', error);
    }
  }

  const PopupDialog = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;

    async function handleUploadinvoice(event: any): Promise<void> {
      event.preventDefault();
      try {
        if (orderAmount !== order.finalTotal) {
          setMismatchAmount(true);
          return;
        }
        const formData = new FormData();
        formData.append('orderAmount', orderAmount.toString()); // Assuming orderAmount is a string or can be converted to a string
        formData.append("vendorId", order.vendorId);
        formData.append("orderId", order.orderId!);
        if (selectedFile) {
          formData.append('file', selectedFile); // Assuming selectedFile is a File object
        } else {
          alert("please upload file");
          return;
        }
        await axios.post('/api/upload/vendor_invoice', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        })
        await updateSellerOrder();
        alert("Invoice uploaded successfully!")
        closePopup()
      } catch (error) {
        alert("Invoice upload Failed!")
        console.log('error :>> ', error);
      }
    }

    return (
      <div key={Math.random()} className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg">
        <div className="bg-white border-4 border-custom-red shadow-lg p-8 rounded-lg w-96">
          <div className="mb-4">
            {mismatchAmount && <p className='text-custom-red text-xs animate-pulse'>**The entered amount does not match the ordered amount. Kindly get in touch with Redbasil for assistance.**</p>}
            <label htmlFor="invoiceTotal" className="block text-sm font-semibold mt-4 text-custom-gray-5">Invoice Total: <span className='text-custom-red'>*</span> </label>
            <input
              name="invoiceTotal"
              type="number"
              placeholder="Enter Amount"
              defaultValue={orderAmount}
              onBlur={(e) => {
                setOrderAmount(Number(e.target.value));
              }}
              className="w-full mt-2 p-2 border-2 border-custom-red rounded focus:outline-none focus:border-custom-red "
            />
          </div>
          <div className="flex items-center justify-center mb-4">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-custom-gray-3 border-dashed rounded-lg cursor-pointer bg-custom-gray-1 hover:bg-custom-gray-2"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-custom-gray-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-custom-gray-4">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-custom-gray-4">SVG, PNG, JPG, or GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {selectedFile && (
            <>
              <p className="mb-2 text-sm text-custom-gray-4">
                <span className="font-semibold">Selected File:</span> {selectedFile.name}
              </p>
              <p className="text-xs text-custom-gray-4">File size: {(selectedFile.size / 1024)} KB</p>
            </>)}
          <div className='flex gap-4 mt-4'>

            <button
              onClick={onClose}
              className="w-full py-2 text-custom-buttonText bg-custom-red hover:bg-custom-red-dark rounded focus:outline-none focus:shadow-outline-custom-red"
            >
              Close
            </button>
            <button
              onClick={handleUploadinvoice}
              className="w-full py-2 text-custom-buttonText bg-custom-red hover:bg-hover-red rounded focus:outline-none focus:shadow-outline-custom-red"
            >
              Upload
            </button>
          </div>

        </div>
      </div>
    );
  };


  async function handleDownloadDeliveryReceipt(): Promise<void> {
    const result = await axios.post('/api/download/delivery_receipt', order, {
      responseType: 'blob', // Set the response type to blob to handle files
    });

    // Create a blob URL and initiate a download
    const blob = new Blob([result.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `redbasil_e-procurement_${orderId}_pod.pdf`); // Set the desired file name
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }

  return (
    <>
    {usePermissions("orderPermissions", "view") ? <>
      <PopupDialog isOpen={isPopupOpen} onClose={closePopup} />

      <div className="p-4">

        <h1 className="text-2xl font-bold text-custom-red mb-4">Order Details</h1>
        <hr className="border-custom-red border mb-4" />
        <div className="flex justify-between items-center mb-6">
          <div>

            <div className='flex'>
              <p className="font-bold text-custom-gray-4">Order Id: </p><span className="text-custom-gray-4">{order.orderId}</span>
            </div>
            <div className='flex'>
              <p className="font-bold text-custom-gray-4">Status:  </p><span className="text-custom-gray-4">{order.status}</span>
            </div>
            <div className='flex'>
              <p className="font-bold text-custom-gray-4">Expt. Delivery Date:  </p><span className="text-custom-gray-4">{order.createdAt?.toDateString()}</span>
            </div>
          </div>
          {order.status === OrderStatus.PENDING && <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button className="bg-custom-red hover:bg-hover-red text-custom-buttonText px-4 py-2 rounded-md" onClick={handleCancel} >Cancel Order</button>
            </div>
          </div>}
          {order.status === OrderStatus.DELIVERED && <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button className="bg-custom-red hover:bg-hover-red text-custom-buttonText px-4 py-2 rounded-md pi pi-cloud-upload" onClick={openPopup} > Upload Invoice </button>
            </div>
          </div>}
          {order.status === OrderStatus.CONFIRMED && <div className="flex space-x-4 mb-2">
            <button className="bg-custom-red hover:bg-hover-red text-custom-buttonText px-4 py-2 rounded-md pi pi-download text-sm" onClick={handleDownloadDeliveryReceipt}> Delivery Receipt</button>
          </div>}
          {order.status === OrderStatus.DELIVERED  && order.isVendorInvoicePresent && <div className="flex space-x-4 mb-2">
            <button className="bg-custom-red hover:bg-hover-red text-custom-buttonText px-4 py-2 rounded-md pi pi-download text-sm" onClick={downloadInvoiceFile}> Download Invoice</button>
          </div>}
        </div>

        <h3 className="text-xl font-bold mb-2">Items Requested</h3>
        <div>
          {order.orderItems.map((lineItem: OrderItem, index) => (
            <VendorOrderLineItem key={index} lineItem={lineItem} order={order} setOrder={setOrder} />
          ))}
        </div>
        <div className="flex flex-row mt-4 justify-between" >
          <div className="mt-4">
            <h3 className="text-lg font-medium">Delivery Address</h3>
            <div className="flex flex-col">
              <p className="text-base font-regular">{order.deliveryAddress.addressLine}</p>
              <p className="text-base font-regular">{order.deliveryAddress.city}</p>
              <p className="text-base font-regular">{order.deliveryAddress.state} , {order.deliveryAddress.pinCode}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-medium">Subtotal: ₹ <span className='text-custom-green'> {order.finalTotalAmount}</span></div>
            <div className="text-lg font-medium">Total Tax: ₹ <span className='text-custom-green'>{order.finalTotalTax}</span></div>
            <hr className="border-custom-gray-4 border mb-4" />

            <div className="text-lg font-bold">Total Amount: ₹ <span className='text-custom-green'>{order.finalTotal}</span></div>
          </div>

        </div>
        {order.status === OrderStatus.PENDING && <div className='flex justify-center'>
          <Button
            label={`${order.finalTotal > 0 ? "ACCEPT" : "CANCEL"} ORDER`}
            type="submit"
            icon="pi pi-check"
            className={`w-full mb-[1rem] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none bg-custom-red text-custom-buttonText`}
            onClick={() => handleOrderUpdate(`${order.finalTotal > 0 ? "ACCEPT" : "CANCEL"}`)}
          />
        </div>}
      </div>
    </>: <AccessDenied />}
    </>
  );

};

export default OrderClientComponent;

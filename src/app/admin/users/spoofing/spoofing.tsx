'use client'
import { UserType } from '@/types/enums';
import { Vendor } from '@/types/vendor';
import { UserRole } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { setCookie } from "cookies-next";
interface Props {
  spoofingTimeout: number;
}
const Spoofing = (props: Props) => {
  const [vendorId, setVendorId] = useState('');
  const [vendorDetails, setVendorDetails] = useState<Vendor | null>(null);
  const { data: session, update } = useSession();

  const handleInputChange = (event: any) => {
    setVendorId(event.target.value);
  };

  const router = useRouter()

  async function updateSession(vendor: Vendor) {
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    const expirationTimeInSeconds = currentTimeInSeconds + props.spoofingTimeout; // after spoofingTimeout minutes user logout automatically
    try {
      await update({
        ...session,
        user: {
          ...session?.user,
          userType: UserType.VENDOR_USER,
          iat: currentTimeInSeconds,
          exp: expirationTimeInSeconds,
          role: UserRole.ADMIN,
          name: vendor.businessName,
        }
      })
      setCookie("vendorId", vendor.vendorId)
      window.open('/', "_self")
    } catch (error) {
      console.log("error", error);
    }
  }
  const handleClick = async () => {
    try {
      await updateSession(vendorDetails!)
    } catch (error) {
      console.log('error :>> ', error);
      alert("Please try after sometime!")
    }
  };

  async function handleVendorSearch() {
    try {
      const result = await axios.get("/api/vendors/get_vendor", { params: { vendorId } })
      const vendor = result.data;
      setVendorDetails(vendor)
    } catch (error) {
      console.log('error :>> ', error);
      alert("Failed to fetch vendor")
    }
  }

  return (
    <>
      <div className="my-4 flex gap-4 items-center">
        <label htmlFor="vendorId" className='font-bold'>Vendor Id:</label>
        <input
          type="text"
          name="vendorId"
          id="vendorId"
          placeholder='  Enter vendor ID'
          value={vendorId}
          onChange={handleInputChange}
          className='border-2 border-custom-red'

        />
        <button className="bg-green-500 text-white rounded px-[5px] py-[3px]" onClick={handleVendorSearch}>Search</button>
      </div>
      <hr />
      <div>
        {vendorDetails && (
          <div className="my-4">
            <h2 className="text-xl font-bold mb-4 text-center">Vendor Details</h2>
            <div className="grid grid-cols-2 gap-4 border-2 p-4">
              <p><span className="font-bold">Vendor ID:</span> {vendorDetails.vendorId}</p>
              <p><span className="font-bold">Business Name:</span> {vendorDetails.businessName}</p>
              <p><span className="font-bold">Business Brand Name:</span> {vendorDetails.businessBrandName || 'N/A'}</p>
              <p><span className="font-bold">GSTIN:</span> {vendorDetails.gstin || 'N/A'}</p>
              <p><span className="font-bold">PAN:</span> {vendorDetails.pan}</p>
              <p><span className="font-bold">Address:</span> {vendorDetails.addressLine}, {vendorDetails.city}, {vendorDetails.state}, {vendorDetails.pinCode}</p>
              <p><span className="font-bold">Country Code:</span> {vendorDetails.countryCode || 'N/A'}</p>
              <p><span className="font-bold">Phone Number:</span> {vendorDetails.phoneNumber}</p>
              <p><span className="font-bold">Status:</span> {vendorDetails.status}</p>
              <p><span className="font-bold">Created By:</span> {vendorDetails.createdBy}</p>
              <p><span className="font-bold">Created At:</span> {vendorDetails.createdAt?.toLocaleString() || 'N/A'}</p>
              <p><span className="font-bold">Updated By:</span> {vendorDetails.updatedBy || 'N/A'}</p>
              <p><span className="font-bold">Updated At:</span> {vendorDetails.updatedAt?.toLocaleString() || 'N/A'}</p>
              <p><span className="font-bold">PG Account ID:</span> {vendorDetails.pgAccountId || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
      <div>
        {vendorDetails && (
          <div className="mt-4 text-center">
            <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={handleClick}>Spoof User</button>
          </div>
        )}
      </div>

    </>
  );
};

export default Spoofing;

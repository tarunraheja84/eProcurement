"use client"
import React, { useState } from 'react';
import ProductSelectionPopup from './ProductSelectionPopup';
import { MasterProduct } from '@/types/masterProduct';
import SelectedProducts from './selectedProducts';

function ProcurementForm() {
  const [isAddProductsPopupOpen, setAddProductsPopupOpen] = useState(false);
  const [prdcts,setPrdcts]=useState<MasterProduct[]>([]);

  const toggleAddProductsPopup = () => {
    setAddProductsPopupOpen(!isAddProductsPopupOpen);
  };
  const updateProducts=(products:MasterProduct[])=>{
    setPrdcts(products);
  }
  return (
        <div className="h-full flex flex-col justify-between">

        <div>
              <h1 className="text-2xl font-bold text-custom-red mb-4">Create Procurement Plan</h1>
              <hr className="border-custom-red border mb-4" />


              <div className="mb-4">
                <label className="block font-bold text-sm mb-2" htmlFor="planName">
                  Plan Name
                </label>
                <input
                  className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                  type="text"
                  id="planName"
                  name="planName"
                  placeholder="Enter Plan Name"
                />
              </div>

            <div className="mb-4">
                <label className="block font-bold text-sm mb-2" htmlFor="approver">
                  Volume Duration
                </label>
                <select
                  className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                  id="volumeDuration"
                  name="volumeDuration"
                  placeholder="Select Volume Duration"
                  defaultValue="" // Add defaultValue here
                >
                  <option value="" disabled>Please select an option</option>
                  <option value="daily">daily</option>
                  <option value="weekly">weekly</option>
                  <option value="monthly">monthly</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-bold text-sm mb-2" htmlFor="approver">
                  Select Approver
                </label>
                <select
                  className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                  id="approver"
                  name="approver"
                  placeholder="Select Approver"
                  defaultValue="" // Add defaultValue here
                >
                  <option value="" disabled>Please select an option</option>
                  <option value="Naman Dayal">Naman Dayal</option>
                  <option value="Amit Khanch">Amit Khanchi</option>
                  <option value="Shivank Shukla">Shivank Shukla</option>
                </select>

              </div>
              <button
                className="block w-1/2 bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 mb-4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mx-auto"
                type="button"
                onClick={toggleAddProductsPopup}
              >
                Add Products
              </button>
              {isAddProductsPopupOpen && <ProductSelectionPopup toggleAddProductsPopup={toggleAddProductsPopup} updateProducts={updateProducts}/>}

              {prdcts && <SelectedProducts selectedProducts={prdcts}/>}
              <button
                className="block w-1/2 bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mx-auto"
                type="button"
              >
                Create Plan
              </button>
            </div>

        </div>
  );
}

export default ProcurementForm;

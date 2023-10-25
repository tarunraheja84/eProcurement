import React, { useContext, useState } from 'react';
import ProductSelectionPopup from './ProductSelectionPopup';
import SelectedProducts from './selectedProducts';
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext';
import { useSession } from 'next-auth/react';
import axios from 'axios';


function ProcurementForm() {
  const [isAddProductsPopupOpen, setAddProductsPopupOpen] = useState(false);
  const [planName,setPlanName]=useState("");
  const [volumeDuration, setVolumeDuration]= useState("weekly");
  const [approver, setApprover] =useState("");
  const { data: session } = useSession();
  const {selectedProducts}=useContext(SelectedProductsContext);
  const toggleAddProductsPopup = () => {   
    setAddProductsPopupOpen(!isAddProductsPopupOpen);
  };

  const handleName=(e:any)=>{
    setPlanName(e.target.value);
  }

  const handleVolumeDuration=(e:any)=>{
      setVolumeDuration(e.target.value)
  }

  const handleApprover=(e:any)=>{
      setApprover(e.target.value)
  }
  
  const createPlan=async ()=>{
    let username;
    if (session && session.user)
        username=session.user.name
      
        const productsArray=[]
        for(const product of Array.from(selectedProducts.values())){
          productsArray.push({
                  productId: product.productId,
                  productName: product.productName,
                  category: product.category,
                  subCategory: product.subCategory,
                  categoryId: product.categoryId,
                  subCategoryId: product.subCategoryId,
                  imgPath: product.imgPath,
                  sellingPrice: product.sellingPrice,
                  packSize: product.packSize,
                  GSTrate: 0,
                  cess: 0
          })
        }

        const procurementPlan={
          procurementName:planName,
          createdBy:username,
          updatedBy:username,
          requestedTo:approver,
          confirmedBy:approver,
          status:"draft",
          volumeDuration:volumeDuration,
          products:productsArray,
        }

        try {
          await axios.post("/api/procurements/create", {procurementPlan, productsArray});
          alert('Procurement Plan Created successfully.');
      } catch (error: any) {
          console.log(error.message);
      }
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
                  onChange={handleName}
                  placeholder="Enter Plan Name"
                />
              </div>

            <div className="mb-4">
                <label className="block font-bold text-sm mb-2" htmlFor="approver">
                  Volume Duration
                </label>
                <select
                  className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                  placeholder="Select Volume Duration"
                  onChange={handleVolumeDuration}
                  defaultValue="weekly" 
                >
                  <option value="weekly">weekly</option>
                  <option value="daily">daily</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-bold text-sm mb-2" htmlFor="approver">
                  Select Approver
                </label>
                <select
                  className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                  onChange={handleApprover}
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
                className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 mb-4 md:w-1/3 mx-auto"
                type="button"
                onClick={toggleAddProductsPopup}
              >
                Add Products
              </button>
              {isAddProductsPopupOpen && <ProductSelectionPopup toggleAddProductsPopup={toggleAddProductsPopup}/>}
              {selectedProducts && <SelectedProducts/>}
              {selectedProducts.size>0 && <button
                className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 md:w-1/3  mx-auto"
                type="button"
                onClick={createPlan}
              >
                Create Plan
              </button>}
            </div>
        </div>
        
  );
}

export default ProcurementForm;

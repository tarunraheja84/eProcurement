import React, { useContext, useEffect, useState } from 'react';
import ProductSelectionPopup from './ProductSelectionPopup';
import SelectedProducts from './selectedProducts';
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { VolumeDuration } from '@/types/enums';

interface Manager{
  name:String
  email:String
}

function ProcurementForm() {
  const [isAddProductsPopupOpen, setAddProductsPopupOpen] = useState(false);
  const [planName,setPlanName]=useState("");
  const [volumeDuration, setVolumeDuration]= useState("weekly");
  const [approver, setApprover] =useState("Naman Dayal");
  const [managers, setManagers]=useState<Manager[]>([]);
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

  const handleApprover=async (e:any)=>{ 
      setApprover(e.target.value)
  }

 
  
  useEffect(()=>{
    (async ()=>{
      const result=await axios.get("/api/fetch_from_db/fetch_dbInternalUsers");
      setManagers(result.data);
    })();
  },[])

  const createPlan=async (e:any)=>{
    e.preventDefault()
    let userMail;
    if (session && session.user)
        userMail=session.user.email
      
        const productsArray=Array.from(selectedProducts.values())

        const procurementPlan={
          procurementName:planName,
          createdBy:userMail,
          updatedBy:userMail,
          requestedTo:approver,
          confirmedBy:"",
          volumeDuration:volumeDuration,
        }


        try {
          const result=await axios.get("/api/fetch_from_db/fetch_dbProcurements");
          const dbProcurementNames=[];
          for(const procurement of result.data){
            dbProcurementNames.push(procurement.procurementName)
          }
          if(dbProcurementNames.includes(planName)){
            alert("There is already a Procurement Plan with this name, please change Plan name")
            return;
          }
          
          await axios.post("/api/procurements/create", {procurementPlan, productsArray});
          alert('Procurement Plan Created successfully.');
          window.location.reload();
      } catch (error: any) {
          console.log(error.message);
          alert(error.message)
      }
  }
  
  return (
        <form onSubmit={createPlan}>
        <div className="h-full flex flex-col justify-between">

        <div>
              <h1 className="text-2xl font-bold text-custom-red mb-4">Create Procurement Plan</h1>
              <hr className="border-custom-red border mb-4" />


              <div className="mb-4">
                <label className="block font-bold text-sm mb-2" htmlFor="planName">
                  Plan Name<span className="text-custom-red text-xs">*</span>
                </label>
                <input
                  className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 mx-auto outline-none"
                  type="text"
                  onChange={handleName}
                  placeholder="Enter Plan Name"
                  required
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
                  defaultValue={VolumeDuration.weekly}
                >
                  <option value={VolumeDuration.weekly}>weekly</option>
                  <option value={VolumeDuration.daily}>daily</option>
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
                  defaultValue="naman@redbasil.in" 
                >
                  {
                    managers && managers.map((manager, index)=>(
                     <option key={index} value={`${manager.email}`}>{manager.name}</option>)
                    )
                  }
                </select>
              </div>
              <div
                className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 mb-4 md:w-1/3 mx-auto text-center cursor-pointer"
                onClick={toggleAddProductsPopup}
              >
                Add Products
              </div>
              {isAddProductsPopupOpen && <ProductSelectionPopup toggleAddProductsPopup={toggleAddProductsPopup}/>}
              {selectedProducts && <SelectedProducts/>}
              {selectedProducts.size>0 && <button
                className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 md:w-1/3  mx-auto"
                type="submit"
              >
                Create Plan
              </button>}
            </div>
        </div>
     </form>
  );
}

export default ProcurementForm;

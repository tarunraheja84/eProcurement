import React, { useContext, useEffect, useState } from 'react';
import ProductSelectionPopup from './ProductSelectionPopup';
import SelectedProducts from './selectedProducts';
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { ProcurementStatus, VolumeDuration } from '@/types/enums';
import { useRouter } from 'next/navigation';

interface Manager{
  name:String
  email:String
}

function ProcurementForm() {
  const [isAddProductsPopupOpen, setAddProductsPopupOpen] = useState(false);
  const [planName,setPlanName]=useState("");
  const [volumeDuration, setVolumeDuration]= useState("weekly");
  const [managers, setManagers]=useState<Manager[]>([]);
  const [approver, setApprover] =useState("");
  const [status, setStatus]= useState("");
  const { data: session } = useSession();
  const router=useRouter();
  const {selectedProducts, setSelectedProducts}=useContext(SelectedProductsContext);
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
      setApprover(result.data[0].name)
    })();
  },[])

  const createPlan=async (e:any)=>{
    e.preventDefault()
    const flag=confirm("Are you sure?");
    if(!flag) return;

    let userMail;
    if (session && session.user)
        userMail=session.user.email
      
        const productsArray=Array.from(selectedProducts.values())
        
        let productsQuantity: { [key: string]: number | undefined } = {};

        for(const product of productsArray){
          productsQuantity[product.productId]=product.quantity;
          delete product.quantity;
        }

        const procurementPlan={
          procurementName:planName,
          createdBy:userMail,
          updatedBy:"",
          requestedTo:status===ProcurementStatus.DRAFT?"":approver,
          status:status,
          confirmedBy:"",
          volumeDuration:volumeDuration,
          products:{
            create:productsArray
          },
          productsQuantity:productsQuantity
        }


        try {
          const result=await axios.get("/api/fetch_from_db/fetch_dbProcurementNames");
          const dbProcurementNames=result.data.map((data:{procurementName:String})=>data.procurementName);
          
          if(dbProcurementNames.includes(planName)){
            alert("There is already a Procurement Plan with this name, please change Plan name")
            return;
          }
          
          await axios.post("/api/procurements/create", procurementPlan);
          alert('Procurement Plan Created successfully.');
          if(status===ProcurementStatus.DRAFT)
            router.push("/procurements?q=my_procurements")
          else
            router.push("/procurements?q=all_procurements")
      } catch (error: any) {
          console.log(error);
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
                >
                  {
                    managers && managers.map((manager, index)=>(
                     <option key={index} value={`${manager.name}`}>{manager.name}</option>)
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
              {selectedProducts.size>0 && 
              <div className="md:flex">
              <button
                className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 md:w-1/3 mx-auto"
                onClick={()=>{setStatus(ProcurementStatus.DRAFT)}}
                type="submit"
              >
                Save as draft
              </button>
              <button
                className="block bg-custom-red text-white hover:bg-hover-red rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0"
                onClick={()=>{setStatus(ProcurementStatus.AWAITING_APPROVAL)}}
                type="submit"
              >
                Create Plan
              </button>
              </div>}
            </div>
        </div>
     </form>
  );
}

export default ProcurementForm;

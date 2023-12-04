import UserRegistrationForm from "@/components/UserForm"

const page = async (context: any) => {
  const vendorId = context.params.vendorId;

  return (
    <div>
        <UserRegistrationForm isForVendorUser={true} vendorId={vendorId} isForUpdate={false}/>
    </div>
  )
}

export default page
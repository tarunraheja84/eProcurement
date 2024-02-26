import UserForm from "@/components/users/UserForm";

const page = async (context: any) => {
  const vendorId = context.params.vendorId;

  return (
        <UserForm vendorId={vendorId} isForVendorUser={true} isForUpdate={false}/>
  )
}

export default page
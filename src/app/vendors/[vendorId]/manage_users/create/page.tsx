import UserForm from "@/components/users/UserForm"

const page = async (context: any) => {
  const vendorId = context.params.vendorId;

  return (
    <div>
        <UserForm vendorId={vendorId} isForUpdate={false}/>
    </div>
  )
}

export default page
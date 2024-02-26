import VendorRegistrationForm from '@/components/vendors/vendorRegistrationForm'
import prisma from '@/lib/prisma'

const page = async (context: any) => {
  const vendorId = context.params.vendorId;
  const vendor = await prisma.vendor.findUnique({
    where: {
      vendorId: vendorId
    }
  })
  return (
    <div>
      <VendorRegistrationForm vendor={vendor} isForUpdate={true} />
    </div>
  )
}

export default page
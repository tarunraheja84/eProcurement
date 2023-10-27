import ViewProcurement from '@/components/viewProcurement';
import prisma from '@/lib/prisma'

const page = async (context: any) => {
  const procurementId = context.params.procurementId;
  const procurementPromise=prisma.procurement.findUnique({
    where: {
      procurementId: procurementId
    }
  });

  const procurementProductsPromise=prisma.procurementProduct.findMany({
    where: {
      procurementId: procurementId,
    },
  });


  const [procurement, procurementProducts] = await Promise.all([procurementPromise,procurementProductsPromise]);

  const productIds=procurementProducts.map((procurementProduct)=>procurementProduct.productId)

  const products=await prisma.product.findMany({
    where: {
      productId: {
        in: productIds,
      },
    },
  });

  const productIdQuantityArray=procurementProducts.map((procurementProduct)=>{return {productId:procurementProduct.productId,quantity:procurementProduct.quantity}})
  return (
    <div>
      <ViewProcurement procurement={procurement} products={products} productIdQuantityArray={productIdQuantityArray}/>
    </div>
  )
}

export default page

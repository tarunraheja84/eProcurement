import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, ProcurementStatus } from "@prisma/client";
import { getUserEmail, getUserName } from "@/utils/utils";
import { ProcurementsType } from "@/types/enums";


export const GET = async (request: NextRequest) => {
  const searchParams: URLSearchParams = request.nextUrl.searchParams;

  const status: ProcurementStatus | null = searchParams.get("status") as ProcurementStatus;
  const procurementId: string | null = searchParams.get("procurementId") as string;
  const page: number | null = Number(searchParams.get("page"));
  const countParam = searchParams.get("count");
  const q: ProcurementsType = searchParams.get("q") as ProcurementsType;

  const [userMail, userName] = await Promise.all([getUserEmail(), getUserName()]);
  try {
      const contextFilters = (q === ProcurementsType.MY_PROCUREMENTS) ? {
        OR: [
          { createdBy: userMail! },
          { updatedBy: userMail! },
          { confirmedBy: userName! },
          { requestedTo: userName! }
        ]
      } : {
        NOT: {
          status: ProcurementStatus.DRAFT
        }
      }
      
      const where: Prisma.ProcurementWhereInput = {};
      if (status)
      where.status = status
    

      if (countParam) {
        const count = await prisma.procurement.count({
          where: { ...where, ...contextFilters }
        });
        return NextResponse.json({ count });
      }
      else if (page) {
        const result = await prisma.procurement.findMany({
          orderBy: {
            updatedAt: 'desc'
          },
          skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
          take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
          where: { ...where, ...contextFilters }
        });
        return NextResponse.json(result);
      }
      else {
        const result = await prisma.procurement.findUnique({
          where:{
            procurementId
          },
          include:{
            products:true
          }
        });
        return NextResponse.json(result);
      }
  }
  catch (error: any) {
    console.log('error  :>> ', error);
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        statusCode = 400;
      }
    }

    return NextResponse.json({ error: error, status: statusCode });
  }
}


export const POST = async (request: NextRequest) => {
  try {
    const procurementPlan = await request.json();

    if (procurementPlan.products) {
      if (procurementPlan.products.create) {
        for (const product of procurementPlan.products.create) {
          delete product.quantity;
        }
      }
      if (procurementPlan.products.delete) {
        for (const product of procurementPlan.products.delete) {
          delete product.quantity;
        }
      }
    }

    const result = await prisma.procurement.create({
      data: procurementPlan
    })
    return NextResponse.json(result);
  } catch (error: any) {
    console.log('error  :>> ', error);
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        statusCode = 400;
      }
    }

    return NextResponse.json({ error: error, status: statusCode });
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const procurementId = body.procurementId;
    const procurementPlan = body.procurementPlan;

    if (procurementPlan.products) {
      if (procurementPlan.products.create) {
        for (const product of procurementPlan.products.create) {
          delete product.quantity;
        }
      }
      if (procurementPlan.products.delete) {
        for (const product of procurementPlan.products.delete) {
          delete product.quantity;
        }
      }
    }

    const result = await prisma.procurement.update({
      where: {
        procurementId: procurementId
      },
      data: procurementPlan
    })
    return NextResponse.json(result);
  } catch (error: any) {
    console.log('error  :>> ', error);
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        statusCode = 400;
      }
    }

    return NextResponse.json({ error: error, status: statusCode });
  }
};




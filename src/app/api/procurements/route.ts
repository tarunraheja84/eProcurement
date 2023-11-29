import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, ProcurementStatus } from "@prisma/client";
import { getUserEmail, getUserName } from "@/utils/utils";


export const GET = async (request: NextRequest) => {
  const searchParams: URLSearchParams = request.nextUrl.searchParams;

  const statusParam = searchParams.get("status");
  const pageParam = searchParams.get("page");
  const countParam = searchParams.get("count");
  const qParam = searchParams.get("q");

  const [userMail, userName] = await Promise.all([getUserEmail(), getUserName()]);

  try {
    if(userMail && userName){
      const contextFilters = qParam === "my_procurements" ? {
        OR: [
          { createdBy: userMail },
          { updatedBy: userMail },
          { confirmedBy: userName },
          { requestedTo: userName }
        ]
    } : {
        NOT: {
          status: ProcurementStatus.DRAFT
        }
    }
      if (statusParam && pageParam) {
        const status: ProcurementStatus | null = statusParam as ProcurementStatus;
        const page: number | null = Number(pageParam);
  
        if (Object.values(ProcurementStatus).includes(status)) {
          const result = await prisma.procurement.findMany({
            skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
            take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
            where: {
              status: status,
              ...contextFilters
            },
          });
          return NextResponse.json(result);
        }
      }
      else if (pageParam) {
        const page: number | null = Number(pageParam);
        const result = await prisma.procurement.findMany({
          skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
          take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
          where:{...contextFilters}
        });
        return NextResponse.json(result);
      }
      else if (countParam && statusParam) {
        const status: ProcurementStatus | null = statusParam as ProcurementStatus;
        const count = await prisma.procurement.count({
          where: {
            status: status,
            ...contextFilters
          }
        });
        return NextResponse.json({ count });
      }
      else if (countParam) {
        const count = await prisma.procurement.count();
        return NextResponse.json({ count });
      }
    }
  }
  catch (error: any) {
    console.log(error)
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
    console.log(error)
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        statusCode = 400;
      }
    }

    return NextResponse.json({ error: error, status: statusCode });
  }
};

export const PATCH = async (request: NextRequest) => {
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
    console.log(error);
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        statusCode = 400;
      }
    }

    return NextResponse.json({ error: error, status: statusCode });
  }
};




import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma, ProcurementStatus } from "@prisma/client";
import { getUserEmail, getUserName } from "@/utils/utils";
import { ProcurementsType } from "@/types/enums";


export const POST = async (request: NextRequest) => {
  
    const [userEmailId, userName, {status, procurementId, page, count, q}] = await Promise.all([getUserEmail(), getUserName(), request.json()]);
    const countParam=count;
    try {
      const contextFilters = (q === ProcurementsType.MY_PROCUREMENTS) ? {
        OR: [
          { createdBy: userEmailId! },
          { updatedBy: userEmailId! },
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
          where: {
            procurementId
          },
          include: {
            products: true
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
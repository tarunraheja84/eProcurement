import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


export const PATCH = async (request: NextRequest) => {
  try {
    const data=await request.json();
    const procurementId=data.procurementId
    delete data.procurementId;

    await prisma.procurement.update({
      where:{
        procurementId:procurementId
      },
      data:data
    })
    return new NextResponse();
  } catch (error: any) {
    console.log(error);
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        statusCode = 400;
      }
    }

    return new NextResponse(error.message, { status: statusCode });
  }
};

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


export const PATCH = async (request: NextRequest) => {
  try {
    const data=await request.json();
    const procurementId=data.procurementId
    delete data.procurementId;

    const result=await prisma.procurement.update({
      where:{
        procurementId:procurementId
      },
      data:data
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

    return NextResponse.json({error: error,  status: statusCode });
  }
};

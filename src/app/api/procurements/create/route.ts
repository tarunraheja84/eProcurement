import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";

export const POST = async (request: NextRequest) => {
    try {
        const procurementPlan = await request.json();
<<<<<<< HEAD
        for(const product of procurementPlan.products.create){
            delete product.quantity;
        }

        if(procurementPlan.products.delete){
            for(const product of procurementPlan.products.delete){
                delete product.quantity;
            }
        }

        const result=await prisma.procurement.create({
            data:procurementPlan
        })
        return NextResponse.json(result);
=======
        await prisma.procurement.create({
            data:procurementPlan
        })
        return new NextResponse();
>>>>>>> 2af4887c963818dacd485ba3d7a245c879e39f2d
    } catch (error: any) {
        console.log(error)
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

<<<<<<< HEAD
        return NextResponse.json({error: error,  status: statusCode });
=======
        return new NextResponse(error.message, { status: statusCode });
>>>>>>> 2af4887c963818dacd485ba3d7a245c879e39f2d
    }
};




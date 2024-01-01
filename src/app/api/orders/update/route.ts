import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import {Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
import { Order } from "@/types/order";


export const PUT = async (request: NextRequest) => {
    try {
        const [jsonBody, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const {order, orderId} : any = jsonBody; //TODO: remove this any
        order.updatedBy = userEmailId ?? "";
        await prisma.order.update({
            where :{
                orderId : orderId
            },
            data : order
        })
        return NextResponse.json({ message: 'success' }, { status: 201 })
    } catch (error: any) {
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};

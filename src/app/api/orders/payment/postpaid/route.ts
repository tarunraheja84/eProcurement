import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { PaymentType, Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";

export const POST = async (request: NextRequest) => {
    try {
        const [{orderIds, paymentId, cxoTxnId}, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        // update cxo and order
        await prisma.$transaction(async (prisma) => {

            // Update the CxoTxn
            await prisma.cxoTransaction.update({
                where: { cxoTxnId: cxoTxnId },
                data: { paymentId: paymentId },
            });

            const updatePromises : any = [];
    
            orderIds.forEach((orderId : string) => {
                updatePromises.push(
                    prisma.order.update({
                      where: { orderId: orderId },
                      data: { paymentType: PaymentType.POSTPAID },
                    })
                  );
            });
            
            // Update the orders 
            await Promise.all(updatePromises);
        });
        return NextResponse.json({ message: 'success' }, { status: 200 })

    } catch (error: any) {
        console.log('error :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};

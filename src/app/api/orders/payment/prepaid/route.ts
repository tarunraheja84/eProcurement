import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { PaymentStatus, PaymentType, Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
import { Payment } from "@/types/payment";

export const POST = async (request: NextRequest) => {
    try {
        const [{orderIds, paymentData}, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const paymentDetails : Payment = {
            paymentId : paymentData.refId,
            paymentDate : new Date(new Date(paymentData.paymentDate).getTime()),
            amount : paymentData.amount,
            paymentType : paymentData.paymentType,
            paymentMethod : paymentData.paymentMethod,
            status : PaymentStatus.TRANSFERRED,
            createdBy: userEmailId!,
            updatedBy: userEmailId!,
        }
        await prisma.$transaction(async (prisma) => {

            // Create the payment
            const createdPayment = await prisma.payment.create({
                data: paymentDetails,
            });

            const updatePromises : any = [];

            orderIds.forEach((orderId : string) => {
                updatePromises.push(
                    prisma.order.update({
                      where: { orderId: orderId },
                      data: { paymentId: createdPayment.id, paymentType: PaymentType.PREPAID },
                    })
                  );
            });
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

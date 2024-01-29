import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { CxoTransactionStatus, Order, Prisma } from "@prisma/client";
import { getUserEmail } from "@/utils/utils";
import axios from "axios";
import { data } from "autoprefixer";
import { CxoTransaction } from "@/types/cxoTransaction";
interface RazorpayResponseData {
        id: string,
        entity: string,
        amount: number,
        amount_paid: number,
        amount_due: number,
        currency: string,
        receipt: string,
        offer_id: null,
        status: string,
        attempts: number,
        notes: { orderIds: string },
        created_at: number
      }
export const POST = async (request: NextRequest) => {
    try {
        const [jsonBody, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const razorpay_key = "rzp_test_VH8sGCX5O347cE"
        const razorpay_secret = "DGtXkeesWBHAUpJaPgUtP6vO" 
        const base64token = Buffer.from(`${razorpay_key}:${razorpay_secret}`).toString('base64')
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: "https://api.razorpay.com/v1/orders",
            headers: {
                'content-type': 'application/json',
                'Authorization': `Basic ${base64token}`
            },
            data: jsonBody.paymentData
        }
        const result = await axios.request(config);
        const razorpayResponseData : RazorpayResponseData = result.data
        const cxoTxnData =  {
            amount : razorpayResponseData.amount,
            status : CxoTransactionStatus.PENDING,
            currency : razorpayResponseData.currency,
            orderIds : jsonBody.orderIds,
            pgOrderId : razorpayResponseData.id,
            createdAt : new Date(razorpayResponseData.created_at * 1000),
            createdBy : userEmailId!,
            updatedBy : userEmailId!
        }

        const cxoResult = await prisma.cxoTransaction.create(
            { data: cxoTxnData }
        )
        const cxoTxnId  = cxoResult.cxoTxnId
        return NextResponse.json({"pgOrderId" : razorpayResponseData.id, cxoTxnId });
    } catch (error: any) {
        console.log('error :>> ', error.response.data);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return new Response(error.message, { status: statusCode });
    }
};

import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import { accessSecret, getUserEmail } from "@/utils/utils";
import axios from "axios";

interface jsonData {
        ifsc_code: string,
        beneficiary_name: string,
        account_type: string,
        account_number: string,
        holderName: string,
        email: string,
        business_name: string,
        business_type: string
        vendorId : string
}

export const POST = async (request: NextRequest) => {
    try {
        const [jsonBody, userEmailId] = await Promise.all([
            request.json(),
            getUserEmail()
        ])
        const razorpayData : jsonData = jsonBody
        let [razorpay_key, razorpay_secret] = await Promise.all([
            accessSecret('RAZORPAY_KEY'),
            accessSecret('RAZORPAY_SECRET')
        ])
        const data = {
            "name": razorpayData.holderName,
            "email": razorpayData.email,
            "tnc_accepted": true,
            "account_details": {
              "business_name": razorpayData.business_name,
              "business_type": razorpayData.business_type
            },
            "bank_account": {
              "ifsc_code": razorpayData.ifsc_code,
              "beneficiary_name": razorpayData.beneficiary_name,
              "account_type": razorpayData.account_type,
              "account_number": parseInt(razorpayData.account_number)
            }
        }
        const base64token = Buffer.from(`${razorpay_key}:${razorpay_secret}`).toString('base64')
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: "https://api.razorpay.com/v1/beta/accounts",
            headers: {
                'Authorization': `Basic ${base64token}`,
                'Content-type': 'application/json'
            },
            data: data
        }
        const result = await axios.request(config)
        const pgAccountId : string = result.data.id;
        await prisma.vendor.update({
            where: { vendorId: razorpayData.vendorId },
            data: { pgAccountId: pgAccountId},
        })
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

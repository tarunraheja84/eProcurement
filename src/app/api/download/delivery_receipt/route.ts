import { cloudFunctionsUrl } from "@/utils/utils";
import axios from "axios";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const order = await request.json();
        const result = await axios.post(cloudFunctionsUrl.downloadDeliveryReceipt, order,{})
        return new Response(result.data, {
            headers: {
                'Content-Type': 'application/pdf', // Set appropriate content type
                'Content-Disposition': 'attachment; filename="delivery_receipt.pdf"', // Set the filename
            },
        });
    } catch (error: any) {
        console.log('error :>> ', error);
        return new Response(error.message, { status: error.statusCode });
    }
};

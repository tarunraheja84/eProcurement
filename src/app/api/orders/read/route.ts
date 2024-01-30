import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import { getUserSessionData } from "@/utils/utils";
import { UserType } from "@/types/enums";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
    const sessionData = await getUserSessionData()
    const isVendorLogin = sessionData?.userType === UserType.VENDOR_USER ? true : false;
   
    const where: Prisma.OrderWhereInput = {};
    try {
        const { page, startDate, endDate, status, count } = await req.json();

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = startDate;
            }
            if (endDate) {
                where.createdAt.lte = endDate;
            }
        }
            
            if (status) {
                where.status = status;
            }

            if(isVendorLogin){
                const cookieStore = cookies();
                const vendorId = cookieStore.get("vendorId")?.value
                where.vendorId=vendorId;
            }

            if (count) {
                const count = await prisma.order.count({where})
                return NextResponse.json({ count });
            }
            else {
                const result = await prisma.order.findMany({
                    orderBy: {
                        updatedAt: 'desc'
                    },
                    include: {
                        vendor: true,
                    },
                    skip: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1),
                    take: Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
                    where: {
                        ...where,
                    }
                })
                console.log('result :>> ', result);
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
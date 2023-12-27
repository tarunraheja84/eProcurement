import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import { OrdersFilterType } from "@/types/enums";


export const POST= async (req:NextRequest)=>{
    const where:Prisma.OrderWhereInput= {};
    try{
        const {startDate, endDate, status, page, filterType, marketPlaceOrderId}= await req.json();
        if(marketPlaceOrderId){
            const orders=await prisma.order.findMany({
                orderBy:{
                  updatedAt: 'desc'
                },
                where:{
                    marketPlaceOrderId
                }
            })
            return NextResponse.json(orders);
        }

        if(filterType===OrdersFilterType.orderDate){
            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate) {
                    where.createdAt.gte = startDate;
                }
                if (endDate) {
                    where.createdAt.lte = endDate;
                }
            }
            
            if (status){
                where.status=status
            }
        }

        if(filterType===OrdersFilterType.deliveryDate){
            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate) {
                    where.createdAt.gte = startDate;
                }
                if (endDate) {
                    where.createdAt.lte = endDate;
                }
            }
            
            if (status){
                where.status=status
            }
        }
        where.status = status;
        const orders=await prisma.order.findMany({
            orderBy:{
              updatedAt: 'desc'
            },
            skip:Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)* page,
            take:Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
            where:{
                ...where
              }
        })
        return NextResponse.json(orders);
    }
    catch (error: any) {
        console.log('error  :>> ', error);
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return NextResponse.json({error: error,  status: statusCode });
    }
}

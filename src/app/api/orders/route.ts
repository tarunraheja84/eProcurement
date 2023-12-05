import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { OrderStatus, Prisma } from "@prisma/client";
import { cookies } from 'next/headers';

type FiltersType={ 
    createdAt?:{
        gte:Date,
        lte:Date
    } 
    status?: OrderStatus}

export const POST= async (req:NextRequest)=>{
    const cookieStore = cookies();
    const vendorId = cookieStore.get("userId")?.value

    let filters:FiltersType={};
    try{
        const body= await req.json();
        if (body.startDate && body.endDate && body.status){
            filters={
                createdAt:{
                    gte:body.startDate,
                    lte:body.endDate
                },
                status:body.status
            }
        }
        else if (body.startDate && body.endDate){
            filters={
                createdAt:{
                    gte:body.startDate,
                    lte:body.endDate
                }
            }
        }
        else if (body.status){
            filters={
                status:body.status
            }
        }
        else{
            filters={}
        }
        
        const orders=await prisma.order.findMany({
            orderBy:{
              updatedAt: 'desc'
            },
            skip:Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)* body.page,
            take:Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE),
            where:{
                vendorId:vendorId,
                ...filters
              }
        })
        return NextResponse.json(orders);
    }
    catch (error: any) {
        console.log(error)
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                statusCode = 400;
            }
        }

        return NextResponse.json({error: error,  status: statusCode });
    }
}

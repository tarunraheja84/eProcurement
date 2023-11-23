import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { OrderStatus, Prisma } from "@prisma/client";

type FiltersType={ 
    createdAt?:{
        gte:Date,
        lte:Date
    } 
    endDate?:Date 
    status?: OrderStatus}

export const POST= async (req:NextRequest)=>{
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
            skip:4* body.page,
            take:4,
            where:{
                vendorId:"65362fe43ee4ee234d73f4cc",
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

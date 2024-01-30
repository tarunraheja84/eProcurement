import { uploadImage } from "@/services/storgage_services";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const data: any = await request.formData();
    const file: File | undefined = data.get("file"); // Use the correct field name
    const vendorId :string = data.get("vendorId");
    const orderId :string = data.get("orderId");
    const orderAmount :number = Number(data.get("orderAmount"));
    if (!file) {
      return new Response("No file provided", { status: 400 });
    }
   
    const fileType :string = file.type.split("/")[1];
    const buffer: Buffer = Buffer.from(await file.arrayBuffer())
    const filename:string  = vendorId

    await uploadImage(buffer, `${filename}/${orderId}`, fileType);
    return NextResponse.json("success")
  } catch (error) {
    return new Response("Failed to create a new ad ", { status: 500 });
  }
};
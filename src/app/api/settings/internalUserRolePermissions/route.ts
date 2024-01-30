import { getUserEmail } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const result = await prisma.settings.findUnique({
            where: {
                settingsName: "internalUserRolePermissions"
            }
        })
        return NextResponse.json(result);        
    }
    catch (error) {
        console.log('error  :>> ', error);
    }
}

export const POST = async (request: NextRequest) => {
    try {
        const [rolePermissions, userEmailId, result] = await Promise.all([
            request.json(),
            getUserEmail(),
            prisma.settings.findUnique({
                where: {
                    settingsName: "internalUserRolePermissions"
                }
            })
        ]);

        if (result) {
            rolePermissions.updatedBy = userEmailId!;

            await prisma.settings.update({
                where: {
                    settingsName: "internalUserRolePermissions"
                },
                data: rolePermissions
            })
        }
        else {
            rolePermissions.createdBy = userEmailId!;
            rolePermissions.updatedBy = userEmailId!;

            await prisma.settings.create({data:rolePermissions})
        }

        return NextResponse.json(result);
    }
    catch (error) {
        console.log('error  :>> ', error);
    }
}
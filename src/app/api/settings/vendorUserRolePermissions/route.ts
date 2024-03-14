import { getUserEmail } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { RolePermissions, UserRole } from "@prisma/client";

export const GET = async () => {
    try {
        let result = await prisma.settings.findUnique({
            where: {
                settingsName: "vendorUserRolePermissions"
            }
        })

        if(!result){
            result = await prisma.settings.create({data:defaultRolePermissions})
        }

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
                    settingsName: "vendorUserRolePermissions"
                }
            })
        ]);
        if (result) {
            rolePermissions.updatedBy = userEmailId!;

            await prisma.settings.update({
                where: {
                    settingsName: "vendorUserRolePermissions"
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

const defaultRolePermissions = {
    settingsName: "vendorUserRolePermissions",
    permissions: {
        [UserRole.USER]: {
            quotationRequestPermissions: RolePermissions.VIEW,
            quotationPermissions: RolePermissions.VIEW,
            orderPermissions: RolePermissions.VIEW,
            vendorUserPermissions: RolePermissions.NONE
        },
        [UserRole.MANAGER]: {
            quotationRequestPermissions: RolePermissions.EDIT,
            quotationPermissions: RolePermissions.EDIT,
            orderPermissions: RolePermissions.VIEW,
            vendorUserPermissions: RolePermissions.EDIT
        },
        [UserRole.ADMIN]: {
            quotationRequestPermissions: RolePermissions.EDIT,
            quotationPermissions: RolePermissions.EDIT,
            orderPermissions: RolePermissions.VIEW,
            vendorUserPermissions: RolePermissions.EDIT
        },
    },
    createdBy:"tarunraheja84@gmail.com",
    updatedBy:"tarunraheja84@gmail.com"
}
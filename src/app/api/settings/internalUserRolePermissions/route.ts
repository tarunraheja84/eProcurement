import { getUserEmail } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { RolePermissions, UserRole } from "@prisma/client";

export const GET = async () => {
    try {
        let result = await prisma.settings.findUnique({
            where: {
                settingsName: "internalUserRolePermissions"
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


const defaultRolePermissions = {
    settingsName: "internalUserRolePermissions",
    permissions: {
        [UserRole.USER]: {
            procurementPermissions: RolePermissions.CREATE,
            quotationRequestPermissions: RolePermissions.CREATE,
            quotationPermissions: RolePermissions.CREATE,
            orderPermissions: RolePermissions.CREATE,
            paymentPermissions: RolePermissions.NONE,
            vendorPermissions: RolePermissions.VIEW,
            internalUserPermissions: RolePermissions.NONE
        },
        [UserRole.MANAGER]: {
            procurementPermissions: RolePermissions.EDIT,
            quotationRequestPermissions: RolePermissions.EDIT,
            quotationPermissions: RolePermissions.EDIT,
            orderPermissions: RolePermissions.EDIT,
            paymentPermissions: RolePermissions.NONE,
            vendorPermissions: RolePermissions.EDIT,
            internalUserPermissions: RolePermissions.VIEW
        },
        [UserRole.ADMIN]: {
            procurementPermissions: RolePermissions.EDIT,
            quotationRequestPermissions: RolePermissions.EDIT,
            quotationPermissions: RolePermissions.EDIT,
            orderPermissions: RolePermissions.EDIT,
            paymentPermissions: RolePermissions.EDIT,
            vendorPermissions: RolePermissions.EDIT,
            internalUserPermissions: RolePermissions.EDIT
        },
    },
    createdBy:"tarunraheja84@gmail.com",
    updatedBy:"tarunraheja84@gmail.com"
}
"use client"
import Loading from '@/app/loading';
import { RolePermissions, UserRole } from '@prisma/client'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

type Props = {
    internalUserRolePermissions: any
}


const InternalUserRolePermissions = ({ internalUserRolePermissions }: Props) => {
    const session: UserSession | undefined = useSession().data?.user;
    const [editPermissions, setEditPermissions] = useState(false);
    const [loading, setLoading] = useState(false);
    const userRoles = [UserRole.USER, UserRole.MANAGER, UserRole.ADMIN];
    const router = useRouter();
    const [rolePermissions, setRolePermissions] = useState({
        settingsName: "internalUserRolePermissions",
        permissions: {
            [UserRole.USER]: {
                procurementPermissions: RolePermissions.VIEW,
                quotationRequestPermissions: RolePermissions.VIEW,
                quotationPermissions: RolePermissions.VIEW,
                orderPermissions: RolePermissions.VIEW,
                paymentPermissions: RolePermissions.NONE,
                vendorPermissions: RolePermissions.VIEW,
                internalUserPermissions: RolePermissions.NONE
            },
            [UserRole.MANAGER]: {
                procurementPermissions: RolePermissions.CREATE,
                quotationRequestPermissions: RolePermissions.CREATE,
                quotationPermissions: RolePermissions.CREATE,
                orderPermissions: RolePermissions.CREATE,
                paymentPermissions: RolePermissions.NONE,
                vendorPermissions: RolePermissions.VIEW,
                internalUserPermissions: RolePermissions.NONE
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
        }
    })


    const handleChange = (entity: string, value: RolePermissions, userRole: UserRole) => {
        setRolePermissions({
            settingsName: "internalUserRolePermissions",
            permissions: {
                ...rolePermissions.permissions,
                [userRole]: {
                    ...rolePermissions.permissions?.[userRole],
                    [entity]: value
                }
            }
        })
    }

    const saveChanges = async () => {
        const flag = confirm("Are you sure?");
        if (!flag) return;
        
        setLoading(true);
        try {
            await axios.post("/api/settings/internalUserRolePermissions", rolePermissions)
            window.location.reload();
            alert("Permissions updated successfully");
        }
        catch (error) {
            console.log('error  :>> ', error);
        }
        setLoading(false);
    }

    const procurementPermissionsMap = {
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "View any Procurement",
        [RolePermissions.CREATE as any]: "View, Create and Edit or Void self-created Procurement",
        [RolePermissions.EDIT as any]: "View, Create and Edit or Void any Procurement"
    }
    const quotationRequestPermissionsMap = {
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "View any Quotation Request",
        [RolePermissions.CREATE as any]: "View, Create and Edit or Void self-created Quotation Request",
        [RolePermissions.EDIT as any]: "View, Create and Edit or Void any Quotation Request"
    }
    const quotationPermissionsMap = {
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "View any Quotation",
        [RolePermissions.CREATE as any]: "View, Create and Accept or Reject Quotations corresponding to self-created Quotation Request",
        [RolePermissions.EDIT as any]: "View, Create and Accept or Reject any Quotation"
    }
    const orderPermissionsMap = {
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "View any Order",
        [RolePermissions.CREATE as any]: "View, Create Purchase Order (P.O.) and Edit self-created Purchase Order",
        [RolePermissions.EDIT as any]: "View, Create and Edit any Purchase Order (P.O.)"
    }
    const paymentPermissionsMap={
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "",
        [RolePermissions.CREATE as any]: "",
        [RolePermissions.EDIT as any]: "Do payments"
    }
    const vendorPermissionsMap = {
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "View Vendors",
        [RolePermissions.CREATE as any]: "",
        [RolePermissions.EDIT as any]: "View, Create and Edit Vendors and Vendor Users"
    }
    const internalUserPermissionsMap = {
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "View Internal Users",
        [RolePermissions.CREATE as any]: "",
        [RolePermissions.EDIT as any]: "View, Create and Edit Internal Users"
    }
    const permissions = (entity: string, map: any, userRole: UserRole) => {
        const parts = entity.split("Permissions");
        let heading = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        heading += 's:';
        return (
            <div className="flex mb-2">
                <div className="font-bold w-52 cursor-pointer">{heading}</div>
                <select className="outline-none rounded-md border border-custom-theme cursor-pointer" defaultValue={internalUserRolePermissions ? internalUserRolePermissions.permissions?.[userRole]?.[entity] : (rolePermissions as any).permissions?.[userRole]?.[entity]} onChange={(e) => { handleChange(entity, e.target.value as RolePermissions, userRole) }}>
                    {map?.[RolePermissions.NONE] && <option value={RolePermissions.NONE}>{map?.[RolePermissions.NONE]}</option>}
                    {map?.[RolePermissions.VIEW] && <option value={RolePermissions.VIEW}>{map?.[RolePermissions.VIEW]}</option>}
                    {map?.[RolePermissions.CREATE] && <option value={RolePermissions.CREATE}>{map?.[RolePermissions.CREATE]}</option>}
                    {map?.[RolePermissions.EDIT] && <option value={RolePermissions.EDIT}>{map?.[RolePermissions.EDIT]}</option>}
                </select>
            </div>
        )
    }
    return (
        <>
            {loading ? <Loading /> :
                <div>
                    <h1 className="text-2xl font-bold text-custom-theme mb-4">Role Permissions</h1>
                    <hr className="border-custom-theme border mb-4" />

                    <div className={`${session?.role===UserRole.ADMIN  ? "": "invisible"} flex flex-col md:flex-row gap-2 justify-end items-end`}>
                        <div className="flex items-center pb-2 md:pb-4">
                            <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => { setEditPermissions(!editPermissions) }}>Edit Permissions</div>
                        </div>

                        <div className="flex items-center pb-2 md:pb-4">
                            <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => { router.push(`/rolePermissions/vendorUser`) }}>View Vendor Side Permissions</div>
                        </div>
                    </div>

                    <div className='overflow-x-auto flex items-center justify-center'>
                        <table className="table-auto border border-black bg-custom-gray-1">
                            <tbody>

                                {userRoles.map((userRole: UserRole, index: number) => (
                                    <tr key={index} className="border-2 border-black">
                                        <th className="p-2 text-center border-black border-2">{userRole}</th>
                                        <td className="p-2">
                                            <ul className="list-disc p-3">
                                                {editPermissions ? permissions("procurementPermissions", procurementPermissionsMap, userRole) : !internalUserRolePermissions || internalUserRolePermissions.permissions?.[userRole].procurementPermissions === RolePermissions.NONE ? "" : <li>{procurementPermissionsMap[internalUserRolePermissions.permissions?.[userRole].procurementPermissions]}</li>}

                                                {editPermissions ? permissions("quotationRequestPermissions", quotationRequestPermissionsMap, userRole) : !internalUserRolePermissions || internalUserRolePermissions.permissions?.[userRole].quotationRequestPermissions === RolePermissions.NONE ? "" : <li>{quotationRequestPermissionsMap[internalUserRolePermissions.permissions?.[userRole].quotationRequestPermissions]}</li>}

                                                {editPermissions ? permissions("quotationPermissions", quotationPermissionsMap, userRole) : !internalUserRolePermissions || internalUserRolePermissions.permissions?.[userRole].quotationPermissions === RolePermissions.NONE ? "" : <li>{quotationPermissionsMap[internalUserRolePermissions.permissions?.[userRole].quotationPermissions]}</li>}

                                                {editPermissions ? permissions("orderPermissions", orderPermissionsMap, userRole) : !internalUserRolePermissions || internalUserRolePermissions.permissions?.[userRole].orderPermissions === RolePermissions.NONE ? "" : <li>{orderPermissionsMap[internalUserRolePermissions.permissions?.[userRole].orderPermissions]}</li>}

                                                {editPermissions ? permissions("paymentPermissions", paymentPermissionsMap, userRole) : !internalUserRolePermissions || internalUserRolePermissions.permissions?.[userRole].paymentPermissions === RolePermissions.NONE ? "" : <li>{paymentPermissionsMap[internalUserRolePermissions.permissions?.[userRole].paymentPermissions]}</li>}

                                                {editPermissions ? permissions("vendorPermissions", vendorPermissionsMap, userRole) : !internalUserRolePermissions || internalUserRolePermissions.permissions?.[userRole].vendorPermissions === RolePermissions.NONE ? "" : <li>{vendorPermissionsMap[internalUserRolePermissions.permissions?.[userRole].vendorPermissions]}</li>}

                                                {editPermissions ? permissions("internalUserPermissions", internalUserPermissionsMap, userRole) : !internalUserRolePermissions || internalUserRolePermissions.permissions?.[userRole].internalUserPermissions === RolePermissions.NONE ? "" : <li>{internalUserPermissionsMap[internalUserRolePermissions.permissions?.[userRole].internalUserPermissions]}</li>}
                                            </ul>
                                        </td>
                                    </tr>
                                ) as any)}
                            </tbody>
                        </table>
                    </div>

                    {editPermissions && <div className="md:flex mt-4">
                        <button
                            className={`cursor-pointer block bg-custom-theme text-custom-buttonText hover:bg-hover-theme rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0`}
                            onClick={saveChanges}
                        >
                            Save Changes
                        </button>
                    </div>}

                </div>}
        </>
    )
}

export default InternalUserRolePermissions

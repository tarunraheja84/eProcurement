"use client"
import Loading from '@/app/loading';
import { UserType } from '@/types/enums';
import { RolePermissions, UserRole } from '@prisma/client'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'

type Props = {
    vendorUserRolePermissions: any
}

const VendorUserRolePermissions = ({ vendorUserRolePermissions }: Props) => {
    const session: UserSession | undefined = useSession().data?.user;
    const isVendorLogin = session?.userType === UserType.VENDOR_USER ? true : false
    const [editPermissions, setEditPermissions] = useState(false);
    const [loading, setLoading] = useState(false);
    const userRoles = [UserRole.USER, UserRole.MANAGER, UserRole.ADMIN];
    const [rolePermissions, setRolePermissions] = useState({
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
        }
    })


    const handleChange = (entity: string, value: RolePermissions, userRole: UserRole) => {
        setRolePermissions({
            settingsName: "vendorUserRolePermissions",
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
            await axios.post("/api/settings/vendorUserRolePermissions", rolePermissions)
            window.location.reload();
            alert("Permissions updated successfully");
        }
        catch (error) {
            console.log('error  :>> ', error);
        }
        setLoading(false);
    }

    const quotationRequestPermissionsMap = {
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "View any Quotation Request",
        [RolePermissions.CREATE as any]: "",
        [RolePermissions.EDIT as any]: "Enter Discount & Proceed"
    }
    const quotationPermissionsMap = {
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "View any Quotation",
        [RolePermissions.CREATE as any]: "",
        [RolePermissions.EDIT as any]: "View, Create, Edit or Void Quotation"
    }
    const orderPermissionsMap = {
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "View any Order",
        [RolePermissions.CREATE as any]: "",
        [RolePermissions.EDIT as any]: ""
    }
    const vendorUserPermissionsMap = {
        [RolePermissions.NONE as any]: "None",
        [RolePermissions.VIEW as any]: "View Users",
        [RolePermissions.CREATE as any]: "",
        [RolePermissions.EDIT as any]: "View, Create and Edit Users"
    }
    const permissions = (entity: string, map: any, userRole: UserRole) => {
        const parts = entity.split("Permissions");
        let heading = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        heading += 's:';
        return (
            <div className="flex mb-2">
                <div className="font-bold w-52 cursor-pointer">{heading}</div>
                <select className="outline-none rounded-md border border-custom-theme cursor-pointer" defaultValue={vendorUserRolePermissions ? vendorUserRolePermissions.permissions?.[userRole]?.[entity] : (rolePermissions as any).permissions?.[userRole]?.[entity]} onChange={(e) => { handleChange(entity, e.target.value as RolePermissions, userRole) }}>
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
                    <h1 className="text-2xl font-bold text-custom-theme mb-4">{isVendorLogin ? "Vendor User": ""} Role Permissions</h1>
                    <hr className="border-custom-theme border mb-4" />

                    <div className={`${!isVendorLogin && session?.role===UserRole.ADMIN ? "": "invisible"} flex flex-col md:flex-row gap-2 justify-end items-end`}>
                        <div className="flex items-center pb-2 md:pb-4">
                            <div className="bg-custom-theme hover:bg-hover-theme px-3 py-2 md:px-5 md:py-3 text-custom-buttonText rounded-md outline-none cursor-pointer" onClick={() => { setEditPermissions(!editPermissions) }}>Edit Permissions</div>
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
                                               
                                                {editPermissions ? permissions("quotationRequestPermissions", quotationRequestPermissionsMap, userRole) : !vendorUserRolePermissions || vendorUserRolePermissions.permissions?.[userRole].quotationRequestPermissions === RolePermissions.NONE ? "" : <li>{quotationRequestPermissionsMap[vendorUserRolePermissions.permissions?.[userRole].quotationRequestPermissions]}</li>}

                                                {editPermissions ? permissions("quotationPermissions", quotationPermissionsMap, userRole) : !vendorUserRolePermissions || vendorUserRolePermissions.permissions?.[userRole].quotationPermissions === RolePermissions.NONE ? "" : <li>{quotationPermissionsMap[vendorUserRolePermissions.permissions?.[userRole].quotationPermissions]}</li>}

                                                {editPermissions ? permissions("orderPermissions", orderPermissionsMap, userRole) : !vendorUserRolePermissions || vendorUserRolePermissions.permissions?.[userRole].orderPermissions === RolePermissions.NONE ? "" : <li>{orderPermissionsMap[vendorUserRolePermissions.permissions?.[userRole].orderPermissions]}</li>}

                                                {editPermissions ? permissions("vendorUserPermissions", vendorUserPermissionsMap, userRole) : !vendorUserRolePermissions || vendorUserRolePermissions.permissions?.[userRole].vendorUserPermissions === RolePermissions.NONE ? "" : <li>{vendorUserPermissionsMap[vendorUserRolePermissions.permissions?.[userRole].vendorUserPermissions]}</li>}
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

export default VendorUserRolePermissions

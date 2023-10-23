'use client'

import { VendorUser } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "primereact/button"

type Props = {
    users: VendorUser[],
    vendorId: String
}
const UsersList = (props: Props) => {
    const router = useRouter();

    const deleteUser = async (user: VendorUser) => {
        try {
            const result = window.confirm(`Are you sure you want to delete user named ${user.name}`);
            if (result) {
                await axios.delete(`/api/vendor_users?userId=${user.userId}`);
                alert("User Deleted Successfully");
            }
        } catch (error: any) {
            alert(error.message);
        }

    }
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border border-black">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-center border-r">Name</th>
                        <th className="p-2 text-center border-r">Email</th>
                        <th className="p-2 text-center border-r">Phone Number</th>
                        <th className="p-2 text-center border-r">Role</th>
                        <th className="p-2 text-center">Edit</th>
                        <th className="p-2 text-center">Delete User</th>
                    </tr>
                </thead>
                <tbody>
                    {props.users.map((user: VendorUser) => (
                        <tr key={user.userId} className="border-b border-black">
                            <td className="p-2 text-center border-r align-middle">{user.name}</td>
                            <td className="p-2 text-center border-r align-middle">{user.email}</td>
                            <td className="p-2 text-center border-r align-middle">{user.phoneNumber}</td>
                            <td className="p-2 text-center border-r align-middle">{user.role}</td>
                            <td className="p-2 text-center border-r align-middle">
                                <Button className='bg-custom-red px-5 py-2 text-white' onClick={() => router.push(`/vendors/${props.vendorId}/manage_users/${user.userId}/edit`)}>Edit</Button>
                            </td>
                            <td className="p-2 text-center align-middle">
                                <Button className='bg-custom-red px-5 py-2 text-white' onClick={() => deleteUser(user)}>Delete User</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UsersList
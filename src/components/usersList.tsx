'use client'

import { User } from "@/types/user"
import axios from "axios"
import { useRouter } from "next/navigation"

type Props = {
    users: User[],
    vendorId?: String,
    isForVendorUsers?:boolean,
    isForInternalUsers?:boolean
}
const UsersList = ({users, vendorId, isForVendorUsers, isForInternalUsers}: Props) => {
    const router = useRouter();

    const deleteUser = async (user: User) => {
        if(isForInternalUsers){
            try {
                const result = window.confirm(`Are you sure you want to delete user named ${user.name}`);
                if (result) {
                    await axios.delete(`/api/users?userId=${user.userId}`);
                    alert("User Deleted Successfully");
                    window.open("/users", "_self");
                }
            } catch (error: any) {
                alert(error.message);
            }
        }
        if(isForVendorUsers){
            try {
                const result = window.confirm(`Are you sure you want to delete user named ${user.name}`);
                if (result) {
                    await axios.delete(`/api/vendor_users?userId=${user.userId}`);
                    alert("User Deleted Successfully");
                    window.open(`/vendors/${vendorId}/manage_users`, "_self");
                }
            } catch (error: any) {
                alert(error.message);
            }
        }
    }

    const convertDateTime=(dateString:string)=>{
        const date = new Date(dateString);

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        const hours12 = hours % 12 || 12;

        const formattedDate = `${dayOfWeek} ${month} ${day}, ${year}`;
        const formattedTime = `${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

        return `${formattedDate} ${formattedTime}`;
    }

    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border border-black">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-center border-r">Name</th>
                        <th className="p-2 text-center border-r">Email</th>
                        <th className="p-2 text-center border-r">Updated At</th>
                        <th className="p-2 text-center border-r">Phone Number</th>
                        <th className="p-2 text-center border-r">Role</th>
                        {isForInternalUsers && <th className="p-2 text-center border-r">Status</th>}
                        <th className="p-2 text-center"></th>
                        {isForVendorUsers && <th className="p-2 text-center"></th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: User) => (
                        <tr key={user.userId} className="border-b border-black">
                            <td className="p-2 text-center border-r align-middle">{user.name}</td>
                            <td className="p-2 text-center border-r align-middle">{user.email}</td>
                            <td className="p-2 text-center border-r align-middle">{convertDateTime(user.updatedAt.toString())}</td>
                            <td className="p-2 text-center border-r align-middle">{user.phoneNumber? user.phoneNumber:"-"}</td>
                            <td className="p-2 text-center border-r align-middle">{user.role}</td>
                            {isForInternalUsers && <td className="p-2 text-center border-r align-middle">{user.status}</td>}
                            <td className={`p-2 text-center ${isForVendorUsers? "border-r":""} align-middle`}>
                                <button className='bg-custom-red hover:bg-hover-red px-5 py-2 text-white rounded-md' onClick={()=>isForVendorUsers?
                                        router.push(`/vendors/${vendorId}/manage_users/${user.userId}/edit`):router.push(`/users/${user.userId}/edit`)}>Edit</button>
                            </td>
                            {isForVendorUsers && <td className="p-2 text-center align-middle">
                                <button className='bg-custom-red hover:bg-hover-red px-5 py-2 text-white rounded-md' onClick={() =>     deleteUser(user)}>Delete User</button>
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UsersList
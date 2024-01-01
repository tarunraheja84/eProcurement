'use client'

import { User } from "@/types/user"
import { UserStatus, UserRole } from "@prisma/client"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { convertDateTime, prevBackButtonColors } from "@/utils/helperFrontendFunctions"
import Loading from "@/app/loading"

type Props = {
    users: User[],
    numberOfUsers: number
    vendorId?: String,
    isForVendorUsers?: boolean,
    isForInternalUsers?: boolean
}
const UsersList = ({ users, numberOfUsers, vendorId, isForVendorUsers, isForInternalUsers }: Props) => {
    const router = useRouter();
    const [Page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [userRole, setUserRole]= useState("");
    const [filteredUsers, setFilteredUsers]= useState(users);
    const [usersList, setUsersList] = useState(users);
    const [totalPages, setTotalPages] = useState(Math.ceil(numberOfUsers / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
    const [loading, setLoading]= useState(false);

    const fetchUsers = async (page: number) => {
        const pagesFetched = Math.ceil(usersList.length / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE));
        if (page > pagesFetched) {
            try {
                setLoading(true);
                const result: { data: User[] }= await axios.get(`/api/${isForInternalUsers?"users":"vendor_users"}?page=${page}&role=${userRole}&status=${status}`);
                setUsersList((prev) => [...prev, ...result.data]);
                setFilteredUsers(result.data);
                setPage(page);
            }
            catch (error) {
                console.log('error  :>> ', error);
            }
            setLoading(false);
        }
        else {
            showLastUsers(page);
        }
    }

    const showLastUsers = async (page: number) => {
        const skip = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1);
        const take = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE);
        setFilteredUsers(usersList.slice(skip, skip + take));
        setPage(page);
    }

    const applyFilters = async () => {
        try {
            setLoading(true);
            const [result, totalFilteredPages] = await Promise.all([axios.get(`/api/${isForInternalUsers?"users":"vendor_users"}?page=${1}&status=${status}&role=${userRole}`),
                axios.get(`/api/${isForInternalUsers?"users":"vendor_users"}?status=${status}&role=${userRole}&count=true`)
            ]);
            setFilteredUsers(result.data);
            setTotalPages(Math.ceil(totalFilteredPages.data.count/Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
            setPage(1);
            setUsersList(result.data);
        }
        catch (error) {
            console.log('error  :>> ', error);
        }
        setLoading(false);
    }

    useEffect(() => {
        prevBackButtonColors(Page, totalPages);
    }, [filteredUsers])

    return (
        <>
            {/* filters */}
            <div className="flex flex-col md:flex-row justify-between p-4 md:py-2 my-4 rounded-md bg-custom-gray-3 space-y-4 md:space-y-0">
                <div></div>
                <div className={`flex flex-col md:flex-row justify-center md:items-center space-y-4 md:space-y-0 md:space-x-4`}>
                    <div className="my-auto xl:pt-2">
                        <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Role: </label>
                        <select
                            defaultValue={status}
                            className="md:ml-2 focus:outline-none cursor-pointer rounded-md"
                            onChange={(e) => {
                                setUserRole(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value={UserRole.USER}>USER</option>
                            <option value={UserRole.ADMIN}>ADMIN</option>
                            <option value={UserRole.MANAGER}>MANAGER</option>
                        </select>
                    </div>

                    <div className="my-auto xl:pt-2">
                        <label className="md:ml-2 text-sm font-medium text-custom-gray-5">Select Status: </label>
                        <select
                            defaultValue={status}
                            className="md:ml-2 focus:outline-none cursor-pointer rounded-md"
                            onChange={(e) => {
                                setStatus(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value={UserStatus.ACTIVE}>ACTIVE</option>
                            <option value={UserStatus.INACTIVE}>INACTIVE</option>
                        </select>
                    </div>

                    <div className="my-auto flex items-center justify-center ">
                        <div className="h-fit md:ml-4 p-2 mt-2 md:mt-0 bg-custom-red hover:bg-hover-red text-white rounded-md outline-none cursor-pointer"
                            onClick={applyFilters}>
                            Apply&nbsp;Filters
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex justify-between items-center pb-4">
            <span>Users List</span>
                <button className="bg-custom-red hover:bg-hover-red px-5 py-3 text-white hidden md:inline-block rounded-md" onClick={() => isForInternalUsers? router.push("/users/create"): router.push(`/vendors/${vendorId}/manage_users/create`)}>Create User</button>
                <Image src="/red-plus.png" className="md:hidden" height={20} width={20} alt="Add" onClick={() => isForInternalUsers? router.push("/users/create"): router.push(`/vendors/${vendorId}/manage_users/create`)} />
            </div>
    {loading ? <Loading />:<>
            {
                filteredUsers.length ?
            <div className="overflow-x-auto">
                <table className="table-auto w-full border border-black">
                    <thead>
                        <tr className="bg-custom-gray-2">
                            <th className="p-2 text-center border-r">S.No</th>
                            <th className="p-2 text-center border-r">Name</th>
                            <th className="p-2 text-center border-r">Email</th>
                            <th className="p-2 text-center border-r">Updated At</th>
                            <th className="p-2 text-center border-r">Phone Number</th>
                            <th className="p-2 text-center border-r">Role</th>
                            <th className="p-2 text-center border-r">Status</th>
                            <th className="p-2 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user: User, index:number) => (
                            <tr key={user.userId} className="border-b border-black">
                                <td className="p-2 text-center border-r align-middle">{Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (Page - 1) + index + 1}</td>
                                <td className="p-2 text-center border-r align-middle">{user.name}</td>
                                <td className="p-2 text-center border-r align-middle">{user.email}</td>
                                <td className="p-2 text-center border-r align-middle">{convertDateTime(user.updatedAt.toString())}</td>
                                <td className="p-2 text-center border-r align-middle">{user.phoneNumber ? user.phoneNumber : "-"}</td>
                                <td className="p-2 text-center border-r align-middle">{user.role}</td>
                                <td className="p-2 text-center border-r align-middle">{user.status}</td>
                                <td className={`p-2 text-center ${isForVendorUsers ? "border-r" : ""} align-middle`}>
                                    <button className='bg-custom-red hover:bg-hover-red px-5 py-2 text-white rounded-md' onClick={() => isForVendorUsers ?
                                        router.push(`/vendors/${vendorId}/manage_users/${user.userId}/edit`) : router.push(`/users/${user.userId}/edit`)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex flex-row-reverse">Page {Page}/{totalPages}</div>
                <div className="flex justify-end gap-2 mt-2">
                                <button id="prevButton" className="bg-custom-red px-3 py-2 text-white rounded-md" onClick={() => {
                                    if (Page > 1)
                                        showLastUsers(Page - 1);
                                }}>← Prev</button>
                                <button id="nextButton" className="bg-custom-red px-3 py-2 text-white rounded-md" onClick={() => {
                                    if (Page < totalPages)
                                        fetchUsers(Page + 1);
                                }}>Next →</button>
                            </div>
            </div>
            : <div className='text-center'>No Users to display</div>
        }
        </>}
        </>
    )
}

export default UsersList
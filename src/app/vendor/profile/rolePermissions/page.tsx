import { UserRole } from '@prisma/client'
import React from 'react'

const page = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-custom-theme mb-4">Role Permissions</h1>
      <hr className="border-custom-theme border mb-4 md:mb-32" />
      <div className='overflow-x-auto flex items-center justify-center'>
        <table className="table-auto border border-black bg-custom-gray-1">
          <tbody>
            <tr className="border-2 border-black">
              <th className="p-2 text-center border-black border-2">{UserRole.USER}</th>
              <td className="p-2">
                <p>1. View any Quotation Request</p>
                <p>2. View any Quotation</p>
                <p>3. View any Order</p>
              </td>
            </tr>

            <tr className="border-2 border-black">
              <th className="p-2 text-center border-black border-2">{UserRole.ADMIN}</th>
              <td className="p-2">
                <p>1. Accept Quotation Request</p>
                <p>2. Accept or Cancel Order</p>
              </td>
            </tr>

            <tr className="border-2 border-black">
              <th className="p-2 text-center border-black border-2">{UserRole.MANAGER}</th>
              <td className="p-2">
                <p>1. Accept Quotation Request</p>
                <p>2. Accept or Cancel Order</p>
                <p>3. Edit or Void any Quotation</p>
                <p>4. Create, View and Edit Users</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default page

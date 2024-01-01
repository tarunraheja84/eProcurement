'use client'
import React from 'react'; 
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function VendorNavBar() {
    const router = useRouter()
    const items: MenuItem[] = [
        {
            label: 'Quotations',
            icon: 'pi pi-fw pi-pencil',
            items: [
                {
                    label: 'Quote Requests',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/quotation_requests'),
                },
                {
                    label: 'Quotations',
                    icon: 'pi pi-fw pi-hourglass',
                    command: () => handleMenuItemClick('/quotations'),
                },
            ]
        },
        {
            label: 'Orders',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Orders History',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/orders'),
                }
            ]
        },
        {
            label: 'Payments',
            icon: 'pi pi-fw pi-calendar',
            items: [
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        {
                            label: 'Save',
                            icon: 'pi pi-fw pi-calendar-plus'
                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-fw pi-calendar-minus'
                        }
                    ]
                },
                {
                    label: 'Archive',
                    icon: 'pi pi-fw pi-calendar-times',
                    items: [
                        {
                            label: 'Remove',
                            icon: 'pi pi-fw pi-calendar-minus'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Create New',
                    icon: 'pi pi-fw pi-plus',
                    command: () => handleMenuItemClick('/vendors/65816843d22ea5564c8ba63c/manage_users/create'),
                },
                {
                    label: 'Manage Users',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/vendors/65816843d22ea5564c8ba63c/manage_users'),
                }
            ]
        },
    ];

    const handleMenuItemClick = (pathName: string) => {
        router.push(pathName)
      };

    

    const SignInOut = <div className="mb-4 md:mb-0">
        <Image onClick={() => {router.push('/profile')}} src={"/person.png"} alt="" width={38} height={38} className="mr-2.5" />
    </div>
    
    return (
        <div className="card">
            <Menubar model={items} className='bg-custom-red mb-8'
            end={SignInOut}
            />
        </div>
    )
}
        
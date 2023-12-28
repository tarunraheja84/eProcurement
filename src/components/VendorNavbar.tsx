'use client'
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import { useSession } from 'next-auth/react';
import { useCookies } from 'react-cookie';

export default function VendorNavBar() {
    const [cookies] : any = useCookies(['user']);
    const vendorId = cookies.vendorId;
    const items: MenuItem[] = [
        {
            label: 'Quotations',
            icon: 'pi pi-fw pi-pencil',
            items: [
                {
                    label: 'Quote Requests',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/vendor/quotations/quotation_requests'),
                },
                {
                    label: 'Quotations',
                    icon: 'pi pi-fw pi-hourglass',
                    command: () => handleMenuItemClick('/vendor/quotations'),
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
                    command: () => handleMenuItemClick('/vendor/orders'),
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
                    command: () => handleMenuItemClick(`/admin/vendors/${vendorId}/manage_users/create`),
                },
                {
                    label: 'Manage Users',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick(`/vendor/manage_users`),
                }
            ]
        },
    ];

    const handleMenuItemClick = (pathName: string) => {
        router.push(pathName)
    };
    const router = useRouter()
    const session: UserSession | undefined = useSession().data?.user;
    const SignInOut = <div className="mb-4 md:mb-0">
        <Image onClick={() => { router.push('/vendor/profile') }} className="rounded-full object-cover cursor-pointer" src={session?.picture!} alt="" width={38} height={38} />
    </div>

    return (
        <div className="card">
            <Menubar model={items} className='bg-custom-red mb-[30px]'
                end={SignInOut}
            />
        </div>
    )
}

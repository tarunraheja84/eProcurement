'use client'
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import { useSession } from 'next-auth/react';

export default function VendorNavBar() {
    const items: MenuItem[] = [
        {
            label: 'Quotations',
            icon: 'pi pi-fw pi-pencil',
            items: [
                {
                    label: 'Active Quotation',
                    icon: 'pi pi-fw pi-bars',
                    command: () => handleMenuItemClick('/vendor/quotations/active_quotation'),
                },
                {
                    label: 'All Quote Requests',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/vendor/quotation_requests/all_quotation_requests'),
                },
                {
                    label: 'All Quotations',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/vendor/quotations/all_quotations'),
                },
            ]
        },
        {
            label: 'Orders',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'All Orders',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/vendor/orders'),
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
                    command: () => handleMenuItemClick(`/vendor/users/create`),
                },
                {
                    label: 'Manage Users',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick(`/vendor/users`),
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
            <Menubar model={items} className='bg-custom-theme mb-[30px]'
                end={SignInOut}
            />
        </div>
    )
}

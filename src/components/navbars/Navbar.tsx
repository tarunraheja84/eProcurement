'use client'
import React from 'react'; 
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import SigninButton from './SigninButton';
import { useRouter } from 'next/navigation';

export default function NavBar() {
    const router = useRouter()
    const items: MenuItem[] = [
        {
            label: 'Procurements',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Create New',
                    icon: 'pi pi-fw pi-plus',
                    command: () => handleMenuItemClick('/procurements/create'),
                },
                {
                    label: 'All Procurements',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/procurements/all_procurements'),
                },
                {
                    label: 'My Plans',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/procurements/my_procurements'),
                },
            ]
        },
        {
            label: 'Quotations',
            icon: 'pi pi-fw pi-pencil',
            items: [
                {
                    label: 'Create Quotation Request',
                    icon: 'pi pi-fw pi-plus',
                    command: () => handleMenuItemClick('/quotation_requests/create'),
                },
                {
                    label: 'All Quotation Requests',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/quotation_requests/all_quotation_requests'),
                },
                {
                    label: 'My Quotation Requests',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/quotation_requests/my_quotation_requests'),
                },
                {
                    label: 'View Quotations',
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
            label: 'Vendors',
            icon: 'pi pi-fw pi-pencil',
            items: [
                {
                    label: 'Create new',
                    icon: 'pi pi-fw pi-plus',
                    command: () => handleMenuItemClick('/vendors/create'),
                },
                {
                    label: 'Vendors List',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/vendors'),
                }
            ]
        },
        {
            label: 'Payments',
            icon: 'pi pi-fw pi-calendar',
            items: [
                {
                    label: 'Archive',
                    icon: 'pi pi-fw pi-calendar-times',
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
                    command: () => handleMenuItemClick('/users/create'),
                },
                {
                    label: 'Manage Users',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/users'),
                }
            ]
        },
    ];

    const handleMenuItemClick = (pathName: string) => {
        router.push(pathName)
      };

    const SignInOut = <div className="mb-4 md:mb-0">
        <SigninButton></SigninButton>
    </div>
    
    return (
        <div className="card">
            <Menubar model={items} className='bg-custom-red mb-8'
            end={SignInOut}
            />
        </div>
    )
}
        
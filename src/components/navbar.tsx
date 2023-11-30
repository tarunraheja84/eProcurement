'use client'
import React from 'react'; 
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import SigninButton from './signinButton';
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
                    // items: [
                    //     {
                    //         label: 'Bookmark',
                    //         icon: 'pi pi-fw pi-bookmark'
                    //     },
                    //     {
                    //         label: 'Video',
                    //         icon: 'pi pi-fw pi-video'
                    //     },

                    // ]
                },
                {
                    label: 'All Procurements',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/procurements?q=all_procurements'),
                },
                {
                    label: 'My Plans',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/procurements?q=my_procurements'),
                },
                // {
                //     label: 'Export',
                //     icon: 'pi pi-fw pi-external-link'
                // }
            ]
        },
        {
            label: 'Quotations',
            icon: 'pi pi-fw pi-pencil',
            items: [
                {
                    label: 'Create Quotation Request',
                    icon: 'pi pi-fw pi-plus',
                    command: () => handleMenuItemClick('/quotations/quotation_requests/create'),
                },
                {
                    label: 'Quotation Requests',
                    icon: 'pi pi-fw pi-history',
                    command: () => handleMenuItemClick('/quotations/quotation_requests'),
                },
                {
                    label: 'Draft Quotations Request',
                    icon: 'pi pi-fw pi-file-edit',
                    command: () => handleMenuItemClick('/quotations/draft_quotation_requests'),
                },
                {
                    label: 'View Quotations',
                    icon: 'pi pi-fw pi-hourglass',
                    command: () => handleMenuItemClick('/quotations'),
                },
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
            label: 'Orders',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-user-plus',

                },
                {
                    label: 'Delete',
                    icon: 'pi pi-fw pi-user-minus',

                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {
                            label: 'Filter',
                            icon: 'pi pi-fw pi-filter',
                            items: [
                                {
                                    label: 'Print',
                                    icon: 'pi pi-fw pi-print'
                                }
                            ]
                        },
                        {
                            icon: 'pi pi-fw pi-bars',
                            label: 'List'
                        }
                    ]
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
        // {
        //     label: 'Logout',
        //     icon: 'pi pi-fw pi-power-off'
        // }
    ];

    const handleMenuItemClick = (pathName: string) => {
        router.push(pathName)
      };

    const SignInOut = <div className="mb-4 md:mb-0">
        <SigninButton></SigninButton>
    </div>
    
    return (
        <div className="card">
            <Menubar model={items} className='bg-custom-red mb-[30px]'
            end={SignInOut}
            />
        </div>
    )
}
        
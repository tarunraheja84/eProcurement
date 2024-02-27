'use client'
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePermissions } from '@/utils/helperFrontendFunctions';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
export default function NavBar() {
    const router = useRouter()
    const session: UserSession | undefined = useSession().data?.user;

    const quotations:MenuItem= {
        label: 'Quotations',
        icon: 'pi pi-fw pi-pencil',
        items: []
    };
    popultateQuotations(quotations,router);

    const orders:MenuItem= {
        label: 'Orders',
        icon: 'pi pi-fw pi-user',
        items: []
    };
    populateOrders(orders,router);

    const users:MenuItem={
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        items: []
    };
    populateUsers(users,router);

    const items:MenuItem[]=[];
    if(!usePermissions("quotationRequestPermissions","none"))
        items.push(quotations);
    if(!usePermissions("orderPermissions","none"))
        items.push(orders);
    if(!usePermissions("vendorUserPermissions","none"))
        items.push(users);

    const SignInOut = <div className="mb-4 md:mb-0">
        <Image onClick={() => { router.push('/vendor/profile') }} className="rounded-full object-cover cursor-pointer" src={session?.picture!} alt="" width={38} height={38} />
    </div>
    return (
        <div className="card">
            <Menubar model={items} className='border-2 border-custom-gray-4 bg-custom-theme mb-[30px] shadow-lg'
            end={SignInOut}
            />
        </div>
    )
}
const popultateQuotations=(quotations:MenuItem,router:AppRouterInstance)=>{
    if(usePermissions("quotationPermissions","view")){
        quotations.items!.push(  {
            label: 'Active Quotation',
            icon: 'pi pi-fw pi-bars',
            command: () => router.push('/vendor/quotations/active_quotation'),
        } as any);
    }
    if(usePermissions("quotationRequestPermissions","view")){
        quotations.items!.push( {
            label: 'All Quote Requests',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/vendor/quotation_requests/all_quotation_requests'),
        } as any);
    }
    if(usePermissions("quotationPermissions","view")){
        quotations.items!.push({
            label: 'All Quotations',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/vendor/quotations/all_quotations'),
        } as any);
    }
}
const populateOrders=(orders:MenuItem,router:AppRouterInstance)=>{
    if(usePermissions("orderPermissions","view")){
        orders.items!.push( {
            label: 'All Orders',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/vendor/orders'),
        } as any);
    }
}

const populateUsers=(internalUsers:MenuItem,router:AppRouterInstance)=>{
    if(usePermissions("vendorUserPermissions","create")){
        internalUsers.items!.push({
            label: 'Create New',
            icon: 'pi pi-fw pi-plus',
            command: () => router.push(`/vendor/users/create`),
        } as any)
    }
    if(usePermissions("vendorUserPermissions","view")){
        internalUsers.items!.push({
            label: 'Manage Users',
            icon: 'pi pi-fw pi-history',
            command: () => router.push(`/vendor/users`),
        } as any);
    }
}
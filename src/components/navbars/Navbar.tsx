'use client'
import React from 'react'; 
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { getPermissions } from '@/utils/helperFrontendFunctions';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function NavBar() {
    const router = useRouter()
    const session: UserSession | undefined = useSession().data?.user;

    const procurements:MenuItem={
        label: 'Procurements',
        icon: 'pi pi-fw pi-file',
        items: []
    };
    populateProcurements(procurements,router);

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

    const vendors:MenuItem={
        label: 'Vendors',
        icon: 'pi pi-fw pi-pencil',
        items: []
    }; 
    populateVendors(vendors,router);

    const payments={
        label: 'Payments',
        icon: 'pi pi-fw pi-calendar',
        items: []
    };
    populatePayments(payments,router);

    const internalUsers:MenuItem={
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        items: []
    };
    populateInternalUsers(internalUsers,router);

    const items:MenuItem[]=[];

    if(!getPermissions("procurementPermissions","none"))
        items.push(procurements);
    if(!getPermissions("quotationPermissions","none"))
        items.push(quotations);
    if(!getPermissions("orderPermissions","none"))
        items.push(orders);
    if(!getPermissions("paymentPermissions","none"))
        items.push(payments);
    if(!getPermissions("vendorPermissions","none"))
        items.push(vendors);
    if(!getPermissions("internalUserPermissions","none"))
        items.push(internalUsers);


    const SignInOut = <div className="mb-4 md:mb-0">
        <Image onClick={() => { router.push('/profile') }} className="rounded-full object-cover cursor-pointer" src={session?.picture!} alt="" width={38} height={38} />
    </div>
    
    return (
        <div className="card">
            <Menubar model={items} className='border-2 border-custom-gray-4 bg-custom-theme mb-[30px] shadow-lg'
            end={SignInOut}
            />
        </div>
    )
}

const populateProcurements=(procurements:MenuItem,router:AppRouterInstance)=>{
    if(getPermissions("procurementPermissions","create")){
        procurements.items!.push({
            label: 'Create New',
            icon: 'pi pi-fw pi-plus',
            command: () => router.push('/procurements/create'),
        } as any);
    }

    if(getPermissions("procurementPermissions","view")){
        procurements.items!.push({
            label: 'All Procurements',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/procurements/all_procurements'),
        } as any);
        procurements.items!.push({
            label: 'My Plans',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/procurements/my_procurements'),
        } as any);
    }
}

const popultateQuotations=(quotations:MenuItem,router:AppRouterInstance)=>{
    if(getPermissions("quotationRequestPermissions","create")){
        quotations.items!.push({
            label: 'Create Quotation Request',
            icon: 'pi pi-fw pi-plus',
            command: () => router.push('/quotation_requests/create'),
        } as any);
    }

    if(getPermissions("quotationRequestPermissions","view")){
        quotations.items!.push({
            label: 'My Quotation Requests',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/quotation_requests/my_quotation_requests'),
        } as any);
        quotations.items!.push({
            label: 'All Quotation Requests',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/quotation_requests/all_quotation_requests'),
        } as any);
    }

    if(getPermissions("quotationPermissions","view")){
        quotations.items!.push({
            label: 'View Quotations',
            icon: 'pi pi-fw pi-hourglass',
            command: () => router.push('/quotations'),
        } as any);
    }
}

const populateOrders=(orders:MenuItem,router:AppRouterInstance)=>{
    if(getPermissions("orderPermissions","view")){
        orders.items!.push({
            label: 'Orders History',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/orders'),
        } as any);
    }
}

const populatePayments = (payments:MenuItem, router:AppRouterInstance) =>{
    if(getPermissions("orderPermissions","edit")){
        payments.items!.push({
            label: 'Payments',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/payments'),
        } as any);
    }
}

const populateVendors=(vendors:MenuItem,router:AppRouterInstance)=>{
    if(getPermissions("vendorPermissions","create")){
        vendors.items!.push({
            label: 'Create new',
            icon: 'pi pi-fw pi-plus',
            command: () => router.push('/vendors/create'),
        } as any);
    }

    if(getPermissions("vendorPermissions","view")){
        vendors.items!.push({
            label: 'Vendors List',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/vendors'),
        } as any)
    }
}

const populateInternalUsers=(internalUsers:MenuItem,router:AppRouterInstance)=>{
    if(getPermissions("internalUserPermissions","create")){
        internalUsers.items!.push({
            label: 'Create New',
            icon: 'pi pi-fw pi-plus',
            command: () => router.push('/users/create'),
        } as any)
    }

    if(getPermissions("internalUserPermissions","view")){
        internalUsers.items!.push({
            label: 'Manage Users',
            icon: 'pi pi-fw pi-history',
            command: () => router.push('/users'),
        } as any);
    }
}


        
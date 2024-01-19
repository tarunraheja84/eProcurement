import { MarketPlaceProduct, Taxes } from "@/types/product";
import { OrderStatus, RolePermissions, UserRole } from "@prisma/client";
import { createContext, useContext } from 'react';
import axios from "axios";
import { useSession } from "next-auth/react";


export const statusColor = (orderStatus: String) => {
    switch (orderStatus) {
        case OrderStatus.PENDING:
            return "text-custom-yellow";
        case OrderStatus.CANCELLED:
            return "text-custom-red";
        case OrderStatus.DELIVERED:
            return "text-custom-green"
    }
}

export const convertDateTime = (dateString: string) => {
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

export const Permissions = createContext<{
    rolePermissions: any
    setRolePermissions: Function
}>({ rolePermissions: {}, setRolePermissions: () => {} })


export const getPermissions= (entityPermissions:string, permissionsType:string)=>{
    const {rolePermissions}=useContext(Permissions);
    const session: UserSession | undefined = useSession().data?.user;

    const permissions={
        NONE: rolePermissions?.[session?.role!]?.[entityPermissions]===RolePermissions.NONE,
        VIEW: rolePermissions?.[session?.role!]?.[entityPermissions]===RolePermissions.VIEW,
        CREATE: rolePermissions?.[session?.role!]?.[entityPermissions]===RolePermissions.CREATE,
        EDIT: rolePermissions?.[session?.role!]?.[entityPermissions]===RolePermissions.EDIT
    }

    permissions.NONE= permissions.NONE;
    permissions.VIEW= permissions.VIEW || permissions.CREATE || permissions.EDIT;
    permissions.CREATE= permissions.CREATE || permissions.EDIT;
    permissions.EDIT= permissions.EDIT;

    switch(permissionsType.toLowerCase()){
        case "none":
            return permissions.NONE;
        case "view":
            return permissions.VIEW;
        case "create":
            return permissions.CREATE;
        case "edit":
            return permissions.EDIT;
        default:
            return false;
    }
}

export const prevBackButtonColors = (Page: number, totalPages: number) => {
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    //prevButton Color
    if (Page === 1) {
        prevButton?.classList.remove("bg-custom-theme", "text-white");
        prevButton?.classList.add("bg-custom-gray-3", "text-black");
    }
    else {
        prevButton?.classList.remove("bg-custom-gray-3", "text-black");
        prevButton?.classList.add("bg-custom-theme", "text-white");
    }

    //nextButton Color
    if (Page === totalPages) {
        nextButton?.classList.remove("bg-custom-theme", "text-white");
        nextButton?.classList.add("bg-custom-gray-3", "text-black");
    }
    else {
        nextButton?.classList.remove("bg-custom-gray-3", "text-black");
        nextButton?.classList.add("bg-custom-theme", "text-white");
    }
}

const round = (value: number, precision: number = 0) => {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}

export const formatAmount = (amt: number) => {
    return round(amt, 2);
}

export const formattedPrice = (price: number) => {
    const formattedPrice = price.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });
    return formattedPrice
}

export const calculateGST = (productIdTaxMap: Map<string, Taxes>, productId: string) => {
    const taxes: Taxes | undefined = productIdTaxMap?.get(productId);
    const [igst, cgst, sgst, cess] = taxes ? [taxes.igst ?? 0, taxes.cgst ?? 0, taxes.sgst ?? 0, taxes.cess ?? 0] : [0, 0, 0, 0]
    const gstRate = (igst ? igst + cess : cgst + sgst + cess);

    return gstRate;
}

export const getTaxRates = async (productIds: string[]) => {
    const result = await axios.post("/api/tax_rates", { productIds })
    const products = result.data;
    const prodIdTaxMap = new Map();
    // Iterate through the products array and populate the map
    products.forEach((product: MarketPlaceProduct) => {
        if (product.productId && product.taxes) {
            prodIdTaxMap.set(product.productId, product.taxes);
        }
    });
    return prodIdTaxMap;
}


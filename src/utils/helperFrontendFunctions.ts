import { MarketPlaceProduct, Product, Taxes } from "@/types/product";
import { OrderStatus, ProcurementStatus, QuotationRequestStatus, QuotationStatus, RolePermissions, UserStatus, VendorStatus } from "@prisma/client";
import { createContext, useContext } from 'react';
import axios from "axios";
import { useSession } from "next-auth/react";

export const procurementStatusColor = (procurementStatus: String) => {
    switch (procurementStatus) {
        case ProcurementStatus.DRAFT:
            return "text-custom-gray-4";
        case ProcurementStatus.AWAITING_APPROVAL:
            return "text-custom-yellow";
        case ProcurementStatus.ACTIVE:
            return "text-custom-green"
        case ProcurementStatus.INACTIVE:
            return "text-custom-red"
    }
}

export const quotationRequestStatusColor = (quotationRequestStatus: String) => {
    switch (quotationRequestStatus) {
        case QuotationRequestStatus.DRAFT:
            return "text-custom-gray-4";
        case QuotationRequestStatus.ACTIVE:
            return "text-custom-yellow";
        case QuotationRequestStatus.EXPIRED:
            return "text-custom-orange"
        case QuotationRequestStatus.VOID:
            return "text-custom-red"
    }
}

export const quotationStatusColor = (quotationStatus: String) => {
    switch (quotationStatus) {
        case QuotationStatus.ACCEPTED:
            return "text-custom-green";
        case QuotationStatus.EXPIRED:
            return "text-custom-orange";
        case QuotationStatus.PENDING:
            return "text-custom-yellow"
        case QuotationStatus.REJECTED:
            return "text-custom-red"
        case QuotationStatus.VOID:
            return "text-custom-gray-4"
    }
}

export const orderStatusColor = (orderStatus: String) => {
    switch (orderStatus) {
        case OrderStatus.PENDING:
            return "text-custom-yellow";
        case OrderStatus.CANCELLED:
            return "text-custom-red";
        case OrderStatus.DELIVERED:
            return "text-custom-green"
        case OrderStatus.CONFIRMED:
            return "text-custom-blue"
    }
}

export const vendorStatusColor = (vendorStatus: String) => {
    switch (vendorStatus) {
        case VendorStatus.ACTIVE:
            return "text-custom-green";
        case VendorStatus.INACTIVE:
            return "text-custom-red";
    }
}

export const userStatusColor = (userStatus: String) => {
    switch (userStatus) {
        case UserStatus.ACTIVE:
            return "text-custom-green";
        case UserStatus.INACTIVE:
            return "text-custom-red";
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
        prevButton?.classList.remove("bg-custom-theme", "text-custom-buttonText");
        prevButton?.classList.add("bg-custom-gray-3", "text-black");
    }
    else {
        prevButton?.classList.remove("bg-custom-gray-3", "text-black");
        prevButton?.classList.add("bg-custom-theme", "text-custom-buttonText");
    }

    //nextButton Color
    if (Page === totalPages) {
        nextButton?.classList.remove("bg-custom-theme", "text-custom-buttonText");
        nextButton?.classList.add("bg-custom-gray-3", "text-black");
    }
    else {
        nextButton?.classList.remove("bg-custom-gray-3", "text-black");
        nextButton?.classList.add("bg-custom-theme", "text-custom-buttonText");
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

export const getTaxRates = async (products: Product[]) => {
    const productIds= products?.map((product:Product)=>product.productId)!;
    const result = await axios.post("/api/tax_rates", { productIds })
    const marketPlaceProducts = result.data;
    const prodIdTaxMap = new Map();
    
    marketPlaceProducts.forEach((marketPlaceProduct: MarketPlaceProduct) => {
        if (marketPlaceProduct.productId && marketPlaceProduct.taxes) {
            prodIdTaxMap.set(marketPlaceProduct.productId, marketPlaceProduct.taxes);
        }
    });

    //masterProduct Taxes preference
    products.forEach((product:Product)=>{
        if(product.taxes)
            prodIdTaxMap.set(product.productId, product.taxes);
    })
    return prodIdTaxMap;
}



'use client'
import Loading from '@/app/loading';
import { Product, Taxes } from '@/types/product';
import { calculateGST, formatAmount, formattedPrice, getPermissions, getTaxRates } from '@/utils/helperFrontendFunctions';
import { Pricing, Quotation, QuotationStatus } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import QuotationItemRow from '@/components/quotations/QuotationItemRow';
import axios from 'axios';
import AccessDenied from '@/app/access_denied/page';
import { ProductStatus } from '@/types/enums';
import { QuotationProducts } from '@/types/quotation';

type Props = {
    quotation?: any,
    quotationRequest?: any,
    vendorId?: string,
    activeQuotationsOfSameVendor: any
}

const QuotationForm = ({ quotation, quotationRequest, vendorId, activeQuotationsOfSameVendor }: Props) => {
    const [loading, setLoading] = useState(false);
    const [commonDiscountPercentage, setCommonDiscountPercentage] = useState(0);
    const [productIdTaxMap, setProductIdTaxMap] = useState<Map<string, Taxes> | null>(null);
    const today = new Date();

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setNewQuotation((prevData: Quotation) => ({
            ...prevData,
            [id]: value,
        }));
    }

    const handleExpiryDateChange = (e: any) => {
        setNewQuotation((prevData: Quotation) => ({
            ...prevData,
            expiryDate: e,
        }));
    }

    const handleDiscountType = (e: any) => {
        const selectedDiscountType = e.target.value;
        const individualDiscountInputs = document.getElementsByClassName("individualDiscountInput");
        const allDiscountsInput = document.getElementById("allDiscountsInput");

        if (selectedDiscountType === "all") {
            for (const individualDiscountInput of Array.from(individualDiscountInputs)) {
                individualDiscountInput?.setAttribute('disabled', 'true');
            }
            allDiscountsInput?.removeAttribute('disabled');
        }
        else {
            for (const individualDiscountInput of Array.from(individualDiscountInputs)) {
                individualDiscountInput?.removeAttribute('disabled');
            }
            allDiscountsInput?.setAttribute('disabled', 'true');
        }
    }
    
    const handleDiscount = (e: any) => {
        const newDiscountPercentage = Number(e.target.value);
        if (newDiscountPercentage < 0 || newDiscountPercentage > 100)
            return;

        setCommonDiscountPercentage(newDiscountPercentage);
        const newQuotationProducts = newQuotation.quotationProducts;

        let amountWithoutDiscount = 0, totalDiscount = 0, totalTax = 0;

        Object.keys(newQuotationProducts).forEach((sellerProductId) => {
            newQuotationProducts[sellerProductId].discountPercentage = newDiscountPercentage;

            const acceptedQty = newQuotationProducts[sellerProductId].acceptedQty;
            const preGSTPrice = newQuotationProducts[sellerProductId].supplierPrice;
            const discountPercentage = newQuotationProducts[sellerProductId].discountPercentage;
            const productId = newQuotation.products?.find((product: Product) => product.sellerProductId === sellerProductId)?.productId!;
            
            amountWithoutDiscount += formatAmount(acceptedQty * preGSTPrice);
            totalDiscount += formatAmount((acceptedQty * preGSTPrice * discountPercentage) / 100);
            totalTax += formatAmount((acceptedQty * preGSTPrice * calculateGST(productIdTaxMap!, productId) / 100))

            if(newQuotationProducts[sellerProductId].discountPercentage===oldQuotationProducts[sellerProductId].discountPercentage && 
                newQuotationProducts[sellerProductId].acceptedQty===oldQuotationProducts[sellerProductId].acceptedQty)
                newQuotationProducts[sellerProductId].productStatus=oldQuotationProducts[sellerProductId].productStatus;
            else
                newQuotationProducts[sellerProductId].productStatus = ProductStatus.OLD_UPDATED;

            if(oldQuotationProducts[sellerProductId].productStatus===ProductStatus.NEW)
                    newQuotationProducts[sellerProductId].productStatus = ProductStatus.NEW;

        })

        const amount = amountWithoutDiscount - totalDiscount;
        const total = amount + totalTax;


        setNewQuotation({
            ...newQuotation,
            amount,
            totalTax,
            total,
            quotationProducts: newQuotationProducts
        })
    }
    const createQuotation = async () => {
        const flag = confirm("Are you sure?");
        if (!flag) return;
        const { products, quotationId, ...quotation } = newQuotation;
        const promises = [];
        setLoading(true);
        if (activeQuotationsOfSameVendor.length) {
            for (const activeQuotation of activeQuotationsOfSameVendor) {
                promises.push(axios.put("/api/quotations/update", { quotation: { status: QuotationStatus.VOID }, quotationId: activeQuotation.quotationId }))
            }
        }
        promises.push(axios.post("/api/quotations/create", quotation));

        try {
            await Promise.all(promises);
            alert("Quotation sent successfully")
            window.open("/vendor/quotations/all_quotations", "_self")
        } catch (error) {
            console.log('error :>> ', error);
        }
        setLoading(false);
    }

    const getOldQuotationRequestProducts = (arr: any) => {
        let newObj: any = {};
        for (let el of arr) {
            for (let sellerProductId in el[0]) {
                let quotationProduct = el[0][sellerProductId];
                if(newQuotation.quotationProducts)
                    quotationProduct = { ...quotationProduct, productStatus: el[1] === QuotationStatus.PENDING  ? quotationProduct.productStatus : ProductStatus.OLD_UNCHANGED };
                newObj = { ...newObj, [sellerProductId]: quotationProduct };
            }
        }
        return newObj;
    }

    const getObjectWithIndividualElements = (arr: any) => {
        let newObj: any = {};
        for (const el of arr) {
            if (Array.isArray(el))
                newObj = { ...newObj, ...getObjectWithIndividualElements(el) }
            else
                newObj = { ...newObj, ...el }
        }
        return newObj;
    }

    const getArrayWithIndividualElements = (arr: any) => {
        let newArr: any = [];
        for (const el of arr) {
            if (Array.isArray(el))
                newArr = [...newArr, ...getArrayWithIndividualElements(el)];
            else
                newArr = [...newArr, el];
        }
        return newArr;
    }

    const getQuotationProducts = () =>{
        let quotationProducts : {
            [key: string]: QuotationProducts; 
        }={};

        const newQuotationRequestProducts= quotationRequest.quotationRequestProducts;
        const oldQuotationRequestProducts= getObjectWithIndividualElements(activeQuotationsOfSameVendor.map((quotation: Quotation) =>   Object.keys(Object(quotation.quotationProducts)).reduce((acc:any, key) => {
            acc[key] = {
                requestedQty: Object(quotation.quotationProducts)[key].requestedQty,
                acceptedQty: Object(quotation.quotationProducts)[key].acceptedQty,
                supplierPrice: Object(quotation.quotationProducts)[key].supplierPrice,
                discountPercentage: Object(quotation.quotationProducts)[key].discountPercentage,
                productStatus: Object(quotation.quotationProducts)[key].productStatus
            }
            return acc;
        }, {})));

        const oldQuotationRequestProducts_status= getObjectWithIndividualElements(activeQuotationsOfSameVendor.map((quotation: Quotation) =>   Object.keys(Object(quotation.quotationProducts)).reduce((acc:any, key) => {
                    acc[`${key}_${quotation.status}`] = {
                        requestedQty:Object(quotation.quotationProducts)[key].requestedQty,
                        acceptedQty:Object(quotation.quotationProducts)[key].acceptedQty,
                        discountPercentage:Object(quotation.quotationProducts)[key].discountPercentage
                    }
                    return acc;
                }, {})));
        

        for(const sellerProductId of Object.keys(oldQuotationRequestProducts)){
            quotationProducts![sellerProductId]= oldQuotationRequestProducts[sellerProductId];
        }

        for(const sellerProductId of Object.keys(newQuotationRequestProducts!)){
            const pendingQuotationProduct = oldQuotationRequestProducts_status[`${sellerProductId}_${QuotationStatus.PENDING}`];
            const acceptedQuotationProduct = oldQuotationRequestProducts_status[`${sellerProductId}_${QuotationStatus.ACCEPTED}`];

            if(pendingQuotationProduct){
                quotationProducts![sellerProductId]= {
                    requestedQty: newQuotationRequestProducts[sellerProductId],
                    acceptedQty: pendingQuotationProduct.acceptedQty,
                    supplierPrice: quotationRequest.pricing === Pricing.FLAVRFOOD_PRICING ? quotationRequest?.products.find((product: Product) => product.sellerProductId === sellerProductId).sellingPrice : 0,
                    discountPercentage: pendingQuotationProduct.discountPercentage,
                    productStatus: ProductStatus.NEW
                }
            }
            else if(acceptedQuotationProduct){
                quotationProducts![sellerProductId]= {
                    requestedQty: newQuotationRequestProducts[sellerProductId],
                    acceptedQty: acceptedQuotationProduct.acceptedQty,
                    supplierPrice: quotationRequest.pricing === Pricing.FLAVRFOOD_PRICING ? quotationRequest?.products.find((product: Product) => product.sellerProductId === sellerProductId).sellingPrice : 0,
                    discountPercentage: acceptedQuotationProduct.discountPercentage,
                    productStatus: ProductStatus.NEW
                }
            }
            else{
                quotationProducts![sellerProductId]= {
                    requestedQty: quotationRequest.quotationRequestProducts[sellerProductId],
                    acceptedQty: quotationRequest.quotationRequestProducts[sellerProductId],
                    supplierPrice: quotationRequest.pricing === Pricing.FLAVRFOOD_PRICING ? quotationRequest?.products.find((product: Product) => product.sellerProductId === sellerProductId).sellingPrice : 0,
                    discountPercentage: 0,
                    productStatus: ProductStatus.NEW
                }
            }
        }
        return quotationProducts!;
    }
    
    const getProducts = () =>{
        const products = [...quotationRequest.products, ...getArrayWithIndividualElements(activeQuotationsOfSameVendor.map((quotation: any) => quotation.products))];
        const sellerProductIdProductMap= new Map<string,Product>();
        for(const product of products){
            sellerProductIdProductMap.set(product.sellerProductId, product); 
        }
       return Array.from(sellerProductIdProductMap.values());
    }

    const getProductIds = () =>{
        return getProducts().map((product : Product)=>product.id);
    }
    
    const [newQuotation, setNewQuotation] = useState(quotation ? quotation : {
        quotationName: quotationRequest.quotationRequestName,
        status: QuotationStatus.PENDING,
        procurementId: quotationRequest.procurementId!,
        vendorId: vendorId!,
        expiryDate: new Date(today.setDate(today.getDate() + 7)),
        total: 0,
        amount: 0,
        totalTax: 0,
        pricing: quotationRequest.pricing,
        products: getProducts(),
        quotationProducts: getQuotationProducts(),
        productIds: getProductIds(),
        quotationRequestId: quotationRequest.quotationRequestId!
    })

    useEffect(() => {
        (async () => {
            const prodIdTaxMap = await getTaxRates(newQuotation?.products);
            setProductIdTaxMap(prodIdTaxMap);
        })();
    }, [])

    const oldQuotationProducts= {
        ...getOldQuotationRequestProducts(activeQuotationsOfSameVendor.map((quotation: Quotation) => [quotation.quotationProducts, quotation.status])),
        ...Object.entries(quotationRequest?.quotationRequestProducts ?? {}).reduce((acc: any, [sellerProductId, requestedQty]) => {
            acc[sellerProductId] = {
                requestedQty,
                acceptedQty: requestedQty,
                supplierPrice: quotationRequest.pricing === Pricing.FLAVRFOOD_PRICING ? quotationRequest?.products.find((product: Product) => product.sellerProductId === sellerProductId).sellingPrice : 0,
                discountPercentage: 0,
                productStatus: ProductStatus.NEW
            };

            return acc;
        }, {})
    };

    return (
        <>
            {getPermissions("quotationPermissions", "create") ? loading ? <Loading /> :
                <>
                    <h1 className="text-2xl font-bold text-custom-theme mb-4">{quotation ? "Update Quotation" : "Create Quotation"}</h1>
                    <hr className="border-custom-theme border mb-4" />

                    <div className="mb-4">
                        <label className="block font-bold text-sm mb-2">
                            Quotation Name
                        </label>
                        <input
                            className="w-full sm:w-1/2 md:w-1/3 lg-w-1/4 xl:w-1/5 border border-custom-theme rounded py-2 px-3 mx-auto outline-none"
                            type="text"
                            id="quotationName"
                            placeholder="Enter Name"
                            defaultValue={newQuotation.quotationName}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold text-sm mb-2">
                            Set Expiry Date<span className="text-custom-theme text-xs">*</span>
                        </label>
                        <DatePicker
                            selected={newQuotation?.expiryDate}
                            onChange={handleExpiryDateChange}
                            minDate={new Date()}
                            dateFormat="MMMM d, yyyy"
                            className="border border-custom-theme rounded py-2 px-3 mx-auto outline-none cursor-pointer"
                        />
                    </div>

                    {newQuotation.pricing === Pricing.FLAVRFOOD_PRICING && <div className="mb-4">
                        <div>
                            <input type="radio" name="discountType" value="individual" onChange={handleDiscountType} defaultChecked />
                            <label className="text-sm ml-2 mb-2" htmlFor="individual">
                                Set Individual Discounts (%)
                            </label>
                        </div>

                        <div>
                            <input type="radio" name="discountType" value="all" onChange={handleDiscountType} />
                            <label className="text-sm ml-2 mb-2" htmlFor="all">
                                Set Discount for all items (%)
                            </label>
                        </div>

                    </div>}

                    {newQuotation.pricing === Pricing.FLAVRFOOD_PRICING && <div className="mb-4">
                        <label className="block font-bold text-sm mb-2">
                            Set Discount for all items (%)
                        </label>
                        <input
                            id="allDiscountsInput"
                            className="w-24 border border-custom-theme rounded py-2 px-3 mx-auto outline-none"
                            type="number"
                            value={commonDiscountPercentage ? commonDiscountPercentage : ""}
                            disabled
                            onChange={handleDiscount}
                        />
                    </div>}

                    <div>
                        <h3 className="text-xl font-bold mb-2">Items Requested</h3>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border border-black">
                                <thead>
                                    <tr className="bg-custom-gray-2">
                                        <th className="p-2 text-center border-r">Product Name</th>
                                        <th className="p-2 text-center border-r">Category</th>
                                        <th className="p-2 text-center border-r">Sub Category</th>
                                        <th className="p-2 text-center border-r">Pack Size</th>
                                        <th className="p-2 text-center border-r">Requested Qty.</th>
                                        <th className="p-2 text-center border-r">Accepted Qty.</th>
                                        <th className="p-2 text-center border-r">Unit Price (exc. GST)</th>
                                        <th className="p-2 text-center border-r">GST Rate</th>
                                        <th className="p-2 text-center border-r">Unit Price (inc. GST)</th>
                                        {newQuotation.pricing === Pricing.FLAVRFOOD_PRICING && <th className="p-2 text-center border-r">Discount (%)</th>}
                                        {newQuotation.pricing === Pricing.FLAVRFOOD_PRICING ? <th className="p-2 text-center">Net Amount (inc. Discount, exc. GST)</th> :
                                            <th className="p-2 text-center">Net Amount (exc. GST)</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {newQuotation.products?.map((product: Product, index: number) => (
                                        <QuotationItemRow key={index} quotation={newQuotation} setQuotation={setNewQuotation} oldQuotationProducts={oldQuotationProducts} product={product} productIdTaxMap={productIdTaxMap} />
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        <div className="flex justify-end">
                            <div className="pt-8 w-fit">
                                <div className='flex gap-2'>
                                    <p className="font-bold text-custom-gray-4">Subtotal:</p><span className="text-custom-gray-4">{formattedPrice(formatAmount(newQuotation.amount))}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <p className="font-bold text-custom-gray-4">+ Total Tax : </p><span className="text-custom-gray-4"> {formattedPrice(formatAmount(newQuotation.totalTax))}</span>
                                </div>
                                <hr className="border-custom-theme border" />
                                <div className='flex gap-2'>
                                    <p className="font-bold text-xl text-custom-gray-4">Total&nbsp;Amount&nbsp;: </p><span className="text-custom-gray-4 text-xl ">{formattedPrice(formatAmount(newQuotation.total))}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:flex">
                        <button
                            className={`${newQuotation.total > 0 ? "bg-custom-theme hover:bg-hover-theme cursor-pointer" : "bg-custom-gray-3 pointer-events-none"} block text-white rounded py-2 px-4 md:w-1/3 mx-auto my-2 md:my-0`}
                            type="submit"
                            onClick={createQuotation}
                        >
                            {quotation ? "Update Quotation" : "Send Quotation"}
                        </button>
                    </div>

                </> : <AccessDenied />}
        </>
    )
}

export default QuotationForm

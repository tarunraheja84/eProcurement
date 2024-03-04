// ProductDetails.tsx
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '@/app/loading';
import { prevBackButtonColors } from '@/utils/helperFrontendFunctions';

interface Props {
    products: any;
    numberOfProducts: number,
}

const ProductDetails = (props: Props) => {
    const [productsList, setProductsList] = useState(props.products);
    const [isSetCustomPrice, setIsSetCustomPrice] = useState<number | null>(null);
    const [filteredProducts, setFilteredProducts] = useState(props.products);
    const [totalPages, setTotalPages] = useState(Math.ceil(props.numberOfProducts / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
    const [loading, setLoading] = useState<boolean>(false)
    const [sellerProductId, setSellerProductId] = useState<string>();
    const [hasChanges, setHasChanges] = useState<number | null>(null);
    const [isBasePriceFilter, setIsBasePriceFilter] = useState("");

    const handleSellingPriceChange = (index: number, value: number) => {
        const updatedProducts = [...productsList];
        updatedProducts[index].sellingPrice = value;
        setProductsList(updatedProducts);
    };
    const [Page, setPage] = useState(1);

    const fetchProducts = async (page: number) => {
        const pagesFetched = Math.ceil(productsList.length / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE));
        if (page > pagesFetched) {
            try {
                setLoading(true);
                const products = await axios.get(`/api/products/getProducts?page=${page}&isBasePriceFilter=${isBasePriceFilter}`);
                const sellerProductIds = products.data.map((product: any) => product.sellerProductId);
                const result = await axios.post('/api/products/getMarketplaceProducts', { sellerProductIds });
                for (let i = 0; i < products.data.length; i++) {
                    if(result.data[i])
                        products.data[i].basePrice = result.data[i].sellingPrice;
                }
                setProductsList((prev: any) => [...prev, ...products.data]);
                setFilteredProducts(products.data);
                setPage(page);
            }
            catch (error) {
                console.log('error  :>> ', error);
            }
            setLoading(false);
        }
        else {
            showLastProducts(page);
        }
    }

    const showLastProducts = async (page: number) => {
        const skip = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1);
        const take = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE);
        setFilteredProducts(productsList.slice(skip, skip + take));
        setPage(page);
    }

    const handleUpdateClick = async (index: number) => {
        try {
            setLoading(true);
            const sellerProductId = productsList[index].sellerProductId
            const result = await axios.get(`/api/products/getProducts?sellerProductId=${sellerProductId}`);
            for (const dbProduct of result.data) {
                dbProduct.sellingPrice = productsList[index].sellingPrice;
                dbProduct.isBasePrice = productsList[index].isBasePrice;
                if (dbProduct.isBasePrice) {
                    const result = await axios.post(`/api/products/getMarketplaceProducts`, { sellerProductIds: [dbProduct.sellerProductId] });
                    const product = result.data[0];
                    dbProduct.sellingPrice = product.sellingPrice;
                }
                delete dbProduct.id;
                await axios.post(`/api/products/update?sellerProductId=${sellerProductId}`, dbProduct)
            }
            setLoading(false);
            alert("Product Details Updated Successfully !")
            window.location.reload();
        } catch (error) {
            setLoading(false);
            console.log('error :>> ', error);
            alert("Failed to update Product Details")
        }
    };

    const handleToggle = async (index: number) => {
        const updatedProducts = [...productsList];
        updatedProducts[index].isBasePrice = !updatedProducts[index].isBasePrice;
        setIsSetCustomPrice(isSetCustomPrice === index ? null : index);
        setProductsList(updatedProducts);
    };

    const handleInputchange = (index: number) => {
        setHasChanges(index);
    };

    const applyFilters = async () => {
        try {
            setLoading(true);
            const [result, totalFilteredPages] = await Promise.all([axios.get(`/api/products/getProducts`, { params: { page:1, sellerProductId:sellerProductId, isBasePriceFilter:isBasePriceFilter } }),
            axios.get(`/api/products/getProducts?count=true`, { params: { sellerProductId:sellerProductId, isBasePriceFilter:isBasePriceFilter } })]);

            setFilteredProducts(result.data);
            setTotalPages(Math.ceil(totalFilteredPages.data.count / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
            setPage(1);
            setProductsList(result.data);
        } catch (error) {
            console.log('error  :>> ', error);
        }
        setLoading(false);
    }
    useEffect(() => {
        prevBackButtonColors(Page, totalPages);
    }, [filteredProducts])
    return (
        <>
            {loading ? <Loading /> :
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold text-custom-theme mb-4">{`Base Price Management`}</h1>
                    <hr className="border-custom-theme border mb-4" />
                    <div className="md:flex bg-custom-gray-3 my-4 rounded-md p-4 justify-between">
                        <div className="flex flex-col md:flex-row gap-2">
                            <div>
                                <label className="md:ml-2 text-sm font-medium text-custom-gray-5"> Mktpl. Seller Product Id : </label>
                                <input
                                    type="text"
                                    placeholder='Enter SellerProduct Id'
                                    defaultValue={sellerProductId}
                                    onChange={(e) => setSellerProductId(e.target.value)}
                                    className='border-2 border-custom-theme solid w-60 rounded outline-none px-2'
                                />
                            </div>
                            <div>
                                <label className="md:ml-2 text-sm font-medium text-custom-gray-5"> Show Products with : </label>
                                <select
                                    value={isBasePriceFilter}
                                    className="filter md:ml-2 focus:outline-none cursor-pointer rounded-md bg-white px-2"
                                    onChange={(e) => {
                                        setIsBasePriceFilter(e.target.value)
                                    }}
                                >
                                    <option value={""}>All Prices</option>
                                    <option value={"marketplace"}>Mktpl. Base Price</option>
                                    <option value={"custom"}>Custom Price</option>
                                </select>
                            </div>
                        </div>
                        <div className="my-auto flex items-center justify-center ">
                            <div className="h-fit md:ml-4 p-2 mt-2 md:mt-0 bg-custom-theme hover:bg-hover-theme text-custom-buttonText rounded-md outline-none cursor-pointer"
                                onClick={applyFilters}>
                                Apply&nbsp;Filters
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="bg-white table-auto w-full border shadow-md rounded my-6">
                            <thead className="bg-custom-gray-2">
                                <tr>
                                    <th>S. No.</th>
                                    <th className="px-4 py-2">Mktpl. Seller Product Id</th>
                                    <th className="px-4 py-2">Product Name</th>
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Subcategory</th>
                                    <th className="px-4 py-2">Base Price</th>
                                    <th className="px-4 py-2"></th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 &&
                                    <h1>
                                        No Records Found !
                                    </h1>}
                                {filteredProducts && filteredProducts.length > 0 && filteredProducts.map((product: any, index: number) => (
                                    <tr key={product.id}>
                                        <td className="border px-4 py-2">{Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (Page - 1) + index + 1}.</td>
                                        <td className="border px-4 py-2">{product.sellerProductId}</td>
                                        <td className="border px-4 py-2">{product.productName}</td>
                                        <td className="border px-4 py-2">{product.category}</td>
                                        <td className="border px-4 py-2">{product.subCategory}</td>
                                        <td className="border px-4 py-2">
                                            {!product.isBasePrice ?
                                                <input
                                                    type="number"
                                                    className="px-2 py-1 border border-custom-theme rounded outline-none w-24"
                                                    defaultValue={product.sellingPrice}
                                                    onChange={(e) => {
                                                        handleSellingPriceChange(Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (Page - 1) + index, parseFloat(e.target.value));
                                                        handleInputchange(index)
                                                    }}
                                                /> :
                                                <div className="px-2 py-1 outline-none w-24">{product.basePrice}</div>
                                            }
                                        </td>
                                        <td className="border px-4 py-2">
                                            <div className='flex items-center'>
                                                <span className={`text-s text-custom-gray-5 dark:text-custom-gray-2 mr-3 ${product.isBasePrice ? "font-extrabold" : "font-medium"}`}>Mktpl.<br />Base Price</span>
                                                <label className={`relative inline-flex items-center cursor-pointer`}>
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={product.isBasePrice ? false : true}
                                                        onChange={() => handleToggle(Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (Page - 1) + index)}
                                                    />
                                                    <div className="w-11 h-6 bg-custom-gray-2 rounded-full dark:bg-custom-gray-5 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-custom-gray-2 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-custom-gray-3 peer-checked:bg-custom-theme"></div>
                                                    <span className={`ml-3 text-s text-custom-gray-5 dark:text-custom-gray-2 ${product.isBasePrice ? "font-medium" : "font-extrabold"}`}>Custom</span>
                                                </label>
                                            </div>
                                        </td>
                                        <td className="border p-2 text-center align-middle">
                                            {
                                                <span className={`${(hasChanges === index || isSetCustomPrice === index) ? "" : "invisible"} text-xs font-bold border p-1 bg-custom-theme text-custom-buttonText cursor-pointer rounded`} onClick={() => handleUpdateClick(Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (Page - 1) + index)}>Save</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-row-reverse">Page {Page}/{totalPages}</div>
                    <div className="flex justify-end gap-2 mt-2">
                        <button id="prevButton" className="bg-custom-theme text-custom-buttonText px-3 py-2 rounded-md" onClick={() => {
                            if (Page > 1)
                                showLastProducts(Page - 1);
                        }}>← Prev</button>
                        <button id="nextButton" className="bg-custom-theme text-custom-buttonText px-3 py-2 rounded-md" onClick={() => {
                            if (Page < totalPages)
                                fetchProducts(Page + 1);
                        }}>Next →</button>
                    </div>
                </div>
            }
        </>
    );
};

export default ProductDetails;

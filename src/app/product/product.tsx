// ProductDetails.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product'; // Import Product type from correct location
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Loading from '@/app/loading';
import { prevBackButtonColors } from '@/utils/helperFrontendFunctions';

interface Props {
    products: Product[];
    numberOfProducts: number,
}

const ProductDetails = (props: Props) => {
    const [products, setProducts] = useState<Product[]>(props.products); // Displaying the first 50 products initially
    const [isEditClicked, setEditClicked] = useState<number | null>(null);
    const [isSetCustomPrice, setIsSetCustomPrice] = useState<number | null>(null);
    const [filteredProducts, setFilteredProducts] = useState(props.products);
    const [totalPages, setTotalPages] = useState(Math.ceil(props.numberOfProducts / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE)));
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [productId, setProductId] = useState<string>();
    const [marketPlaceProductId, setMarketPlaceProductId] = useState<string>();
    const [hasChanges, setHasChanges] = useState<number | null>(null);
    const router = useRouter();
    const handleSellingPriceChange = (index: number, value: number) => {
        const updatedProducts = [...products];
        updatedProducts[index].sellingPrice = value;
        setProducts(updatedProducts);
    };
    const [Page, setPage] = useState(1);

    const fetchProcurements = async (page: number) => {
        const pagesFetched = Math.ceil(products.length / Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE));
        if (page > pagesFetched) {
            try {
                setIsLoading(true);
                const result: { data: Product[] } = await axios.get(`/api/products?page=${page}`);
                setProducts((prev) => [...prev, ...result.data]);
                setFilteredProducts(result.data);
                setPage(page);
            }
            catch (error) {
                console.log('error  :>> ', error);
            }
            setIsLoading(false);
        }
        else {
            showLastProcurements(page);
        }
    }

    const showLastProcurements = async (page: number) => {
        const skip = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE) * (page - 1);
        const take = Number(process.env.NEXT_PUBLIC_RESULTS_PER_PAGE);
        setFilteredProducts(products.slice(skip, skip + take));
        setPage(page);
    }

    const handleUpdateClick = async (index: number) => {
        try {
            setIsLoading(true);
            const productId = products[index].id
            const result = await axios.get(`/api/products/getproduct?productId=${productId}`);
            let dbProduct: Product = result.data.product;
            dbProduct.sellingPrice = products[index].sellingPrice;
            dbProduct.isBasePrice = products[index].isBasePrice;
            if (dbProduct.isBasePrice) {
                const result = await axios.post(`/api/products/getmarketplaceproduct`, { productIds: [dbProduct.productId] });
                const product: Product = result.data[0];
                dbProduct.sellingPrice = product.sellingPrice;
            }
            delete dbProduct.id;
            await axios.post(`/api/products/update?productId=${productId}`, dbProduct)
            setIsLoading(false);
            alert("Product Details Updated Successfully !")
            window.location.reload();
        } catch (error) {
            setIsLoading(false);
            console.log('error :>> ', error);
            alert("Failed to update Product Details")
        }
        // You might want to trigger an API call or save these changes to a database here
    };
    const handleEditClick = (index: number) => {
        setEditClicked(index);
    };

    const handleToggle = (index: number) => {
        const updatedProducts = [...products];
        updatedProducts[index].isBasePrice = !updatedProducts[index].isBasePrice;
        setIsSetCustomPrice(isSetCustomPrice ===  index ? null :index);
        setProducts(updatedProducts);
    };

    const handleInputchange = (index: number) => {
        setHasChanges(index);
    };

    const applyFilters = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(`/api/products/getproduct`, { params: { productId, marketPlaceProductId } });
            const product: Product = result.data.product
            if (product) {
                setProducts([product])
            } else {
                setProducts([])
            }
        } catch (error) {
            console.log('error  :>> ', error);
        }
        setIsLoading(false);
    }
    useEffect(() => {
        prevBackButtonColors(Page, totalPages);
    }, [filteredProducts])
    return (
        <>
            {isLoading ? <Loading/> :
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold text-custom-theme mb-4">{`Base Price Management`}</h1>
                    <hr className="border-custom-theme border mb-4" />
                    <div className="md:flex bg-custom-gray-3 my-4 rounded-md p-4 justify-between">
                        <div>
                            <label htmlFor="sellerOrderId">ProductId : </label>
                            <input
                                name='productId'
                                type="text"
                                placeholder='Enter Id'
                                defaultValue={productId}
                                onChange={(e) => {
                                    setProductId(e.target.value);
                                }}
                                className='border-2 border-custom-theme solid w-60 text-center rounded'
                            />
                            <label htmlFor="sellerOrderId"> Mktpl. Seller Product Id : </label>
                            <input
                                name='marketPlaceProductId'
                                type="text"
                                placeholder='Enter Id'
                                defaultValue={marketPlaceProductId}
                                onChange={(e) => setMarketPlaceProductId(e.target.value)}
                                className='border-2 border-custom-theme solid w-60 text-center rounded'
                            />
                        </div>
                        <div className="h-fit md:ml-4 p-2 mt-2 md:mt-0 bg-custom-theme hover:bg-hover-theme text-custom-buttonText rounded-md outline-none cursor-pointer"
                            onClick={applyFilters}>
                            Apply&nbsp;Filters
                        </div>
                    </div>
                    <table className="min-w-full bg-white shadow-md rounded my-6">
                        <thead className="text-left bg-custom-gray-2">
                            <tr>
                                <th className="px-4 py-2">Product Id</th>
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
                            {filteredProducts && filteredProducts.length > 0 && filteredProducts.map((product, index) => (
                                <tr key={product.id}>
                                    <td className="border px-4 py-2">{product.id}</td>
                                    <td className="border px-4 py-2">{product.productId}</td>
                                    <td className="border px-4 py-2">{product.productName}</td>
                                    <td className="border px-4 py-2">{product.category}</td>
                                    <td className="border px-4 py-2">{product.subCategory}</td>
                                    <td className="border px-4 py-2">
                                        {!product.isBasePrice ?
                                            <input
                                                type="number"
                                                className="w-full px-2 py-1 border border-custom-theme rounded"
                                                value={product.sellingPrice}
                                                onChange={(e) =>{
                                                    handleSellingPriceChange(index, parseFloat(e.target.value));
                                                    handleInputchange(index)
                                                }}
                                            /> :
                                            product.sellingPrice
                                        }
                                    </td>
                                    <td className="border px-4 py-2">
                                        <div className='flex items-center'>
                                            <span className={`text-s text-custom-gray-5 dark:text-custom-gray-2 mr-3 ${product.isBasePrice ? "font-extrabold" :"font-medium"}`}>Base Price</span>
                                            <label className={`relative inline-flex items-center cursor-pointer`}>
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={product.isBasePrice ? false : true}
                                                    onChange={() => handleToggle(index)}
                                                />
                                                <div className="w-11 h-6 bg-custom-gray-2 rounded-full peer peer-focus:ring-4 peer-focus:ring-custom-theme dark:peer-focus:ring-hover-red dark:bg-custom-gray-5 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-custom-gray-2 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-custom-gray-3 peer-checked:bg-custom-theme"></div>
                                                <span className={`ms-3 text-s text-custom-gray-5 dark:text-custom-gray-2 ${product.isBasePrice ? "font-medium": "font-extrabold"}`}>Custom</span>
                                            </label>
                                        </div>
                                    </td>
                                    <td className="border p-2 text-center align-middle">
                                        { (hasChanges === index || isSetCustomPrice === index) &&
                                            <span className='text-xs font-bold border p-1 bg-custom-theme text-custom-buttonText cursor-pointer rounded' onClick={() => handleUpdateClick(index)}>Save</span>
                                        }
                                    </td>
                                    {/* <td className="border p-2 text-center align-middle">

                                    </td> */}
                                    {/* {product.isBasePrice && >
                                        <td className="border px-4 py-2 ">
                                                {
                                                    !product.isBasePrice && <span className='text-xs font-bold border p-1 bg-custom-theme text-custom-buttonText cursor-pointer rounded' onClick={() => handleUpdateClick(index)}>Save</span>
                                                }
                                    </td>} */}
                                    {/* </td> */}
                                    {/* {product.isBasePrice && isSetCustomPrice === index? (
                                        <td className="border p-2 text-center align-middle">
                                            <button
                                                className='bg-custom-theme rounded-lg p-2 hover:bg-hover-red text-custom-buttonText pi pi-pencil'
                                                onClick={() => handleEditClick(index)}
                                            ></button>
                                        </td>
                                    ) : (
                                        <td className="border px-4 py-2 ">
                                            {
                                                !product.isBasePrice && 
                                            }
                                        </td>
                                    )} */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex flex-row-reverse">Page {Page}/{totalPages}</div>
                            <div className="flex justify-end gap-2 mt-2">
                                <button id="prevButton" className="bg-custom-theme text-custom-buttonText px-3 py-2 rounded-md" onClick={() => {
                                    if (Page > 1)
                                        showLastProcurements(Page - 1);
                                }}>← Prev</button>
                                <button id="nextButton" className="bg-custom-theme text-custom-buttonText px-3 py-2 rounded-md" onClick={() => {
                                    if (Page < totalPages)
                                        fetchProcurements(Page + 1);
                                }}>Next →</button>
                    </div>
                </div>
            }
        </>
    );
};

export default ProductDetails;

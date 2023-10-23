import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { DebounceInput } from 'react-debounce-input';
import { MasterProduct } from '@/types/masterProduct';
import { Product } from '@/types/product';
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext';

interface Props {
  toggleAddProductsPopup: () => void,
}

interface SearchSuggestion {
  name: string,
  category: string
}

function ProductSelectionPopup({ toggleAddProductsPopup }: Props) {
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [query, setQuery] = useState("");

  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const { selectedProducts } = useContext(SelectedProductsContext);
  const [selectedProductsSize, setSelectedProductsSize] = useState(selectedProducts.size);

  const handleProductSearch = async (e: any) => {
    setQuery(e.target.value);
    setSearchValue(e.target.value);
  }

  const isSelected = (productId: string, product: Product) => {
    if (!selectedProducts.has(productId)) {
      selectedProducts.set(productId, product);
    }
    setSelectedProductsSize(selectedProducts.size)
  };

  const removeProduct = (productId: string) => {
    if (selectedProducts.has(productId)) {
      selectedProducts.delete(productId);
    }
    setSelectedProductsSize(selectedProducts.size)
  };


  const getSearchSugg = (searchProduct: SuggestionHit[]) => {
    let childrenTiles: SearchSuggestion[] = [];
    searchProduct.forEach((el: SuggestionHit) => {
      const sugObj = el;
      const term = sugObj.query;
      let matches = sugObj.products ? sugObj.products.facets.exact_matches : sugObj.prod_products?.facets.exact_matches;
      {
        matches?.category.forEach((cat: { value: string, count: number }) => {
          let temObj: { name: string, category: string } = {
            name: '',
            category: ''
          };
          temObj.name = term;
          temObj.category = cat.value;
          childrenTiles.push(temObj)
        })
      }
    })
    setSearchSuggestions(childrenTiles);
  };
  const getSearchObject = async (term: string, category: string) => {
    const result = await axios.post("/api/search/get_products_with_category", { term, category });
    setProducts(result.data.hits);
    setSearchSuggestions([]);
  }

  const getAllSearchResults = async (query: string) => {
    const result = await axios.post("/api/search/get_products", { query });
    setProducts(result.data.hits);
    setSearchSuggestions([]);
  }

  useEffect(() => {
    const search = async () => {
      try {
        const result = await axios.post("/api/search/get_search_suggestions", { query })
        getSearchSugg(result.data.hits);
      } catch (error: any) {
        console.log(error);
      }
    }

    if (query.length >= 3) {
      (async () => {
        await search();
      })();
    }
  }, [query]);

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-10">
        <div
          className="relative bg-white border border-gray-300 shadow-lg rounded p-6 flex flex-col"
          style={{ width: '80%', height: '80%' }}
        >
          <div className="flex justify-between flex-col md:flex-row">
          <button
              className="self-end text-gray-500 md:hidden"
              onClick={toggleAddProductsPopup}
            >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            </button>
            <h2 className="self-start md:text-2xl mb-4">Select Products</h2>
            <div className="hidden md:block">Total Products Selected: {selectedProductsSize}</div>
            <button
              className="hidden self-end mb-6 text-gray-500 md:block"
              onClick={toggleAddProductsPopup}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <DebounceInput
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border border-custom-red rounded py-2 px-3 outline-none"
            placeholder="Search"
            type="text"
            minLength={3}
            debounceTimeout={300}
            defaultValue={searchValue}
            onChange={handleProductSearch}
            onKeyDown={(e) => { e.key === "Enter" && query && getAllSearchResults(query); }}
          />
          <div className="text-custom-red text-xs ml-0 md:ml-20">*Enter minimum 3 letters to search</div>
          <div className="mt-2 text-xs md:hidden">Total Products Selected: {selectedProductsSize}</div>
          {query && searchSuggestions.length > 0 && (
            <div className="absolute bg-white z-30 top-[146px] md:top-[114px] h-80 md:h-fit shadow-md rounded-lg md:p-4 sm:w-1/2 overflow-auto">
              {searchSuggestions.map((el, index) => (
                <div
                  key={index}
                  className="py-2 cursor-pointer hover:bg-red-100 my-2 px-4 break-all"
                  onClick={() => getSearchObject(el.name, el.category)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="16px" height="16px" className="inline-block"><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" /></svg>
                  <span className="ml-2 font-semibold text-lg">&nbsp;&nbsp;{el.name}</span>
                  <span className="font-normal">&nbsp;in&nbsp;</span>
                  <span className="font-semibold text-custom-red text-lg">{el.category}</span>
                </div>
              ))}
              {query && (
                <div
                  className="py-2 cursor-pointer hover:bg-red-100 my-2 px-4 break-all"
                  onClick={() => getAllSearchResults(query)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="16px" height="16px" className="inline-block"><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" /></svg>
                  <span className="ml-2 font-semibold text-lg">&nbsp;&nbsp;See all results&nbsp;</span>
                  <span className="font-normal">for&nbsp;</span>
                  <span className="font-semibold text-lg">{`"${query}"`}</span>
                </div>
              )}
            </div>
          )}

          {products.length > 0 && <div className="my-2 shadow-[0_0_0_2px_rgba(0,0,0,0.1)] overflow-y-auto">
            {
              products.map((newProduct: MasterProduct, index: number) => {
                let productMap: Map<string, Product> = new Map<string, Product>();
                newProduct.productMap = productMap;
                productMap.set(newProduct.productId, {
                  productId: newProduct.productId,
                  productName: newProduct.name,
                  category: newProduct.category,
                  subCategory: newProduct.subcategory,
                  categoryId: newProduct.categoryId,
                  subCategoryId: newProduct.subcategoryId,
                  imgPath: newProduct.imgPath,
                  quantity: selectedProducts.has(newProduct.productId) ? selectedProducts.get(newProduct.productId)!.quantity : 0,
                  sellingPrice: newProduct.sellingPrice,
                  packSize: newProduct.packSize,
                  GSTrate: 0,
                  cess: 0
                })
                if (newProduct.packSizeVariants) {
                  for (const productId of Object.keys(newProduct.packSizeVariants)) {
                    productMap.set(productId, {
                      productId: productId,
                      productName: newProduct.name,
                      category: newProduct.category,
                      subCategory: newProduct.subcategory,
                      categoryId: newProduct.categoryId,
                      subCategoryId: newProduct.subcategoryId,
                      imgPath: newProduct.imgPath,
                      quantity: selectedProducts.has(productId) ? selectedProducts.get(productId)!.quantity : 0,
                      sellingPrice: newProduct.variantPrices[productId],
                      packSize: newProduct.packSizeVariants[productId],
                      GSTrate: 0,
                      cess: 0
                    })
                  }
                }
                return (
                  <ProductCard key={index} newProduct={newProduct} isSelected={isSelected} removeProduct={removeProduct} />
                )
              })
            }
          </div>
          }
          {/* <div className="flex mx-auto">
      <button
        className="m-2 bg-green-500 text-white px-2 md:px-4 py-2 rounded hover:bg-green-700"
        onClick={()=>{toggleAddProductsPopup();}}
      >
        Back
      </button>
      </div> */}
        </div>
      </div>
    </>
  );
}

export default ProductSelectionPopup;

import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { DebounceInput } from 'react-debounce-input';
import { MasterProduct } from '@/types/masterProduct';
import { SelectedProductsContext } from '@/contexts/SelectedProductsContext';
import { DbProductsDataContext } from '@/contexts/DbProductsDataContext';
import CrossIcon from '@/svg/CrossIcon';
import SearchIcon from '@/svg/SearchIcon';
import { SuggestionHit } from '@/types/suggestionHit';
import { Product } from '@/types/product';

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

  const { selectedProducts } = useContext(SelectedProductsContext);
  const {setDbProductsData}= useContext(DbProductsDataContext);
  const [products, setProducts] = useState<MasterProduct[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  // const [scrollMargin, setScrollMargin]= useState(0.5);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // /for implementing infinite scroll bar

  // const handleScroll = (scrollMargin:number) => {
  //   const container = containerRef.current;
  //     const { scrollTop, scrollHeight, clientHeight } = container!;
  //     if (scrollHeight - scrollTop === clientHeight+ scrollMargin) {
  //       // When the user scrolls to the bottom, fetchNextProducts
  //       setScrollMargin(prev=>prev-0.5);
  //       fetchNextProducts();
  //     }
  // };
  
  // useEffect(() => {
  //   // Attach the scroll event listener to the container
  //   const container = containerRef.current!;
  //   container.addEventListener('scroll', ()=>{handleScroll(scrollMargin)});

  //   return () => {
  //     // Remove the event listener when the component unmounts
  //     container.removeEventListener('scroll', ()=>{handleScroll(scrollMargin)});
  //   };
  // }, [products]);

  const handleProductSearch = async (e: any) => {
    setQuery(e.target.value);
    setSearchValue(e.target.value);
  }

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
    setProducts(result.data.hits)
    setSearchSuggestions([]);
  }

  const getAllSearchResults = async (query: string) => {
    const result = await axios.post("/api/search/get_products", { query });
    setProducts(result.data.hits)
    setSearchSuggestions([]);
  }

  useEffect(() => {
    const search = async () => {
      try {
        const result = await axios.post("/api/search/get_search_suggestions", { query })
        getSearchSugg(result.data.hits);
      } catch (error) {
        console.log('error  :>> ', error);
      }
    }

    if (query.length >= 3) {
      (async () => {
        await search();
      })();
    }
  }, [query]);

  useEffect(()=>{
    (async () => {
      const result= await axios.get("/api/products");
      setDbProductsData(result.data);
    })();
  },[])

  return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-10">
        <div
          className="relative bg-white border border-custom-gray-3 shadow-lg rounded p-6 flex flex-col"
          style={{ width: '80%', height: '80%' }}
        >
          <div className="flex justify-between flex-col md:flex-row">
          <div
              className="self-end text-custom-gray-4 md:hidden cursor-pointer"
              onClick={toggleAddProductsPopup}
            >
            <CrossIcon />
            </div>
            <h2 className="self-start md:text-2xl mb-4">Select Products</h2>
            <div className="text-sm md:text-base">Total Products Selected: {selectedProducts.size}</div>
            <div
              className="hidden self-end mb-6 text-custom-gray-4 md:block cursor-pointer w-6 h-6"
              onClick={toggleAddProductsPopup}
            >
              <CrossIcon />
            </div>
          </div>
          <DebounceInput
            className="w-full md:w-1/6 border border-custom-theme rounded py-2 px-3 outline-none"
            placeholder="Search"
            type="text"
            minLength={3}
            debounceTimeout={300}
            defaultValue={searchValue}
            onChange={handleProductSearch}
            onKeyDown={(e) => { e.key === "Enter" && query && getAllSearchResults(query)}}
          />
          <div className="text-custom-theme text-xs ml-0 md:ml-20">*Enter minimum 3 letters to search</div>
          {query && searchSuggestions.length > 0 && (
            <div className="absolute bg-white z-30 top-[170px] md:top-28 h-60 md:h-fit shadow-md rounded-lg md:p-4 sm:w-1/2 overflow-auto">
              {searchSuggestions.map((el, index) => (
                <div
                  key={index}
                  className="py-2 cursor-pointer hover:bg-hover-theme hover:bg-opacity-20 my-2 px-4 break-all"
                  onClick={() => {
                    getSearchObject(el.name, el.category)
                  }}
                >
                  <span className="inline-block"><SearchIcon /></span>
                  <span className="ml-2 font-semibold text-lg">&nbsp;&nbsp;{el.name}</span>
                  <span className="font-normal">&nbsp;in&nbsp;</span>
                  <span className="font-semibold text-custom-theme text-lg">{el.category}</span>
                </div>
              ))}
              {query && (
                <div
                  className="py-2 cursor-pointer hover:bg-hover-theme hover:bg-opacity-20 my-2 px-4 break-all"
                  onClick={() => {
                    getAllSearchResults(query)
                  }}
                >
                  <span className="inline-block"><SearchIcon /></span>
                  <span className="ml-2 font-semibold text-lg">&nbsp;&nbsp;See all results&nbsp;</span>
                  <span className="font-normal">for&nbsp;</span>
                  <span className="font-semibold text-lg">{`"${query}"`}</span>
                </div>
              )}
            </div>
          )}
      {products.length > 0 && <div ref={containerRef} className="my-2 shadow-[0_0_0_2px_rgba(0,0,0,0.1)] overflow-y-auto">
            {
              products.map((masterProduct: MasterProduct, index: number) => {
                let productMap: Map<string, Product> = new Map<string, Product>();
                masterProduct.productMap = productMap;
                const newProduct:Product= {
                  sellerProductId: masterProduct.objectID,
                  productId: masterProduct.productId,
                  productName: masterProduct.name,
                  category: masterProduct.category,
                  subCategory: masterProduct.subcategory,
                  categoryId: masterProduct.categoryId,
                  subCategoryId: masterProduct.subcategoryId,
                  imgPath: masterProduct.imgPath,
                  quantity: selectedProducts.has(masterProduct.objectID) ? selectedProducts.get(masterProduct.objectID)?.quantity : 0,
                  sellingPrice: masterProduct.sellingPrice,
                  isBasePrice:true,
                  packSize: masterProduct.packSize,
                  taxes: {
                    igst:masterProduct.taxes && masterProduct.taxes.igst ? masterProduct.taxes.igst: 0,
                    cgst:masterProduct.taxes && masterProduct.taxes.cgst ? masterProduct.taxes.cgst: 0,
                    sgst:masterProduct.taxes && masterProduct.taxes.sgst ? masterProduct.taxes.sgst: 0,
                    cess:masterProduct.taxes && masterProduct.taxes.cess ? masterProduct.taxes.cess: 0
                  }
                }
                if(!masterProduct.taxes) delete newProduct.taxes;

                productMap.set(newProduct.sellerProductId,newProduct);

                if (masterProduct.packSizeVariants) {
                  
                  for (const sellerProductId of Object.keys(masterProduct.packSizeVariants)) {
                    const newProduct:Product={
                      sellerProductId: sellerProductId,
                      productId: masterProduct?.productIdMap?.[sellerProductId],
                      productName: masterProduct.name,
                      category: masterProduct.category,
                      subCategory: masterProduct.subcategory,
                      categoryId: masterProduct.categoryId,
                      subCategoryId: masterProduct.subcategoryId,
                      imgPath: masterProduct.imgPath,
                      quantity: selectedProducts.has(sellerProductId) ? selectedProducts.get(sellerProductId)!.quantity : 0,
                      sellingPrice: masterProduct.variantPrices[sellerProductId],
                      isBasePrice:true,
                      packSize: masterProduct.packSizeVariants[sellerProductId],
                      taxes: {
                        igst:masterProduct.taxes && masterProduct.taxes.igst ? masterProduct.taxes.igst: 0,
                        cgst:masterProduct.taxes && masterProduct.taxes.cgst ? masterProduct.taxes.cgst: 0,
                        sgst:masterProduct.taxes && masterProduct.taxes.sgst ? masterProduct.taxes.sgst: 0,
                        cess:masterProduct.taxes && masterProduct.taxes.cess ? masterProduct.taxes.cess: 0
                      }
                    }
                    productMap.set(sellerProductId, newProduct);
                  }
                }
                return (
                  <ProductCard key={index} masterProduct={masterProduct}/>
                )
              })
            }
          </div>
          }
          {
            !products.length && <div className="text-center">No products to display</div>
          }
        </div>
      </div>
  );
}

export default ProductSelectionPopup;

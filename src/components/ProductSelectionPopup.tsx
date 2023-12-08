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


  // const handleScroll = (scrollMargin:number) => {
  //   const container = containerRef.current;
  //   if (container) {
  //     const { scrollTop, scrollHeight, clientHeight } = container;
  //     if (scrollHeight - scrollTop === clientHeight+ scrollMargin) {
  //       // When the user scrolls to the bottom, fetchNextProducts
  //       setScrollMargin(prev=>prev-0.5);
  //       fetchNextProducts();
  //     }
  //   }
  // };
  
  // useEffect(() => {
  //   // Attach the scroll event listener to the container
  //   const container = containerRef.current;
  //   if (container) {
  //     container.addEventListener('scroll', ()=>{handleScroll(scrollMargin)});
  //   }

  //   return () => {
  //     // Remove the event listener when the component unmounts
  //     if (container) {
  //       container.removeEventListener('scroll', ()=>{handleScroll(scrollMargin)});
  //     }
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
            className="w-full md:w-1/6 border border-custom-red rounded py-2 px-3 outline-none"
            placeholder="Search"
            type="text"
            minLength={3}
            debounceTimeout={300}
            defaultValue={searchValue}
            onChange={handleProductSearch}
            onKeyDown={(e) => { e.key === "Enter" && query && getAllSearchResults(query)}}
          />
          <div className="text-custom-red text-xs ml-0 md:ml-20">*Enter minimum 3 letters to search</div>
          {query && searchSuggestions.length > 0 && (
            <div className="absolute bg-white z-30 top-[146px] md:top-[114px] h-80 md:h-fit shadow-md rounded-lg md:p-4 sm:w-1/2 overflow-auto">
              {searchSuggestions.map((el, index) => (
                <div
                  key={index}
                  className="py-2 cursor-pointer hover:bg-light-hover-red my-2 px-4 break-all"
                  onClick={() => {
                    getSearchObject(el.name, el.category)
                  }}
                >
                  <span className="inline-block"><SearchIcon /></span>
                  <span className="ml-2 font-semibold text-lg">&nbsp;&nbsp;{el.name}</span>
                  <span className="font-normal">&nbsp;in&nbsp;</span>
                  <span className="font-semibold text-custom-red text-lg">{el.category}</span>
                </div>
              ))}
              {query && (
                <div
                  className="py-2 cursor-pointer hover:bg-light-hover-red my-2 px-4 break-all"
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
              products.map((product: MasterProduct, index: number) => {
                let productMap: Map<string, Product> = new Map<string, Product>();
                product.productMap = productMap;
                const newProduct:Product= {
                  productId: product.productId,
                  productName: product.name,
                  category: product.category,
                  subCategory: product.subcategory,
                  categoryId: product.categoryId,
                  subCategoryId: product.subcategoryId,
                  imgPath: product.imgPath,
                  quantity: selectedProducts.has(product.productId) ? selectedProducts.get(product.productId)!.quantity : 0,
                  sellingPrice: product.sellingPrice,
                  packSize: product.packSize,
                  taxes: {
                    igst:product.taxes && product.taxes.igst ? product.taxes.igst: 0,
                    cgst:product.taxes && product.taxes.cgst ? product.taxes.cgst: 0,
                    sgst:product.taxes && product.taxes.sgst ? product.taxes.sgst: 0,
                    cess:product.taxes && product.taxes.cess ? product.taxes.cess: 0
                  }
                }
                if(!product.taxes) delete newProduct.taxes;

                productMap.set(newProduct.productId,newProduct);

                if (product.packSizeVariants) {
                  
                  for (const productId of Object.keys(product.packSizeVariants)) {
                    const newProduct:Product={
                      productId: productId,
                      productName: product.name,
                      category: product.category,
                      subCategory: product.subcategory,
                      categoryId: product.categoryId,
                      subCategoryId: product.subcategoryId,
                      imgPath: product.imgPath,
                      quantity: selectedProducts.has(productId) ? selectedProducts.get(productId)!.quantity : 0,
                      sellingPrice: product.variantPrices[productId],
                      packSize: product.packSizeVariants[productId],
                      taxes: {
                        igst:product.taxes && product.taxes.igst ? product.taxes.igst: 0,
                        cgst:product.taxes && product.taxes.cgst ? product.taxes.cgst: 0,
                        sgst:product.taxes && product.taxes.sgst ? product.taxes.sgst: 0,
                        cess:product.taxes && product.taxes.cess ? product.taxes.cess: 0
                      }
                    }
                    productMap.set(productId, newProduct);
                  }
                }
                return (
                  <ProductCard key={index} masterProduct={product}/>
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

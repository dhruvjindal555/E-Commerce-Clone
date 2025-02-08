import React, { useContext, useEffect, useState } from 'react';
import Filter from '../Filter';
import ProductsItem from './ProductsItem';
import { useLoaderData } from 'react-router';
import LoadingContext from '../../context/LoadingContext/LoadingContext';
import LoadingPage from '../LoadingPage';

const Products = () => {
  const products = useLoaderData()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [brands, setBrands] = useState([])
  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueBrands = new Set(products.map(product => product.brand));
      let brandsArray = [...uniqueBrands];
      brandsArray = brandsArray.filter((e) => {
        return e !== undefined
      });
      setBrands(brandsArray)
      console.log("BrandsArray", brandsArray);
    }
    // const sortedProducts = [...products].sort((a, b) =>
      // b.price - a.price
    // );
    // console.log('Sorted Products:', sortedProducts);
    setFilteredProducts(products)
    // console.log('Filtered Products Updated:', filteredProducts);
  }, [products])
  return (
    <div className='lg:grid lg:grid-cols-5 md:mx-5 mx-2'>
      <div className=''>
        <Filter
          products={products}
          brands={brands}
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
        />
      </div>
      <div className='col-span-4 flex gap-1 flex-col'>
        <div className='w-full flex justify-end'>
          <span className='w-fit mx-10'>
            {`Showing ${filteredProducts.length} of ${products.length} results`}
          </span>
        </div>
        {filteredProducts.length > 0 ? filteredProducts.map((product, index) => {
          return <ProductsItem key={index} product={product} />
        }) :
          <div className='w-full h-full flex items-center justify-center'>
            <div className='text-4xl font-semibold'>Articles not available</div>
          </div>
        }
      </div>
    </div>
  );
};

export default Products;




export const productsLoader = async ({ params }) => {
  const { mainCategory, subCategory } = params;
  try {
    const response = await fetch(`http://localhost:8888/product/getAllProduct`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    console.log('Response from backend:', data);
    const productsData = data.data || [];
    let filteredProducts = [];
    if (subCategory) {
      filteredProducts = productsData.filter(product => {
        return (
          product.mainCategory === mainCategory &&
          product.subCategory === subCategory
        );
      });
    } else {
      filteredProducts = productsData.filter(product => {
        return (
          product.mainCategory === mainCategory
        );
      });
    }

    console.log("Filtered Products:", filteredProducts);
    return filteredProducts
  } catch (error) {
    console.error('Error fetching product:', error);
    return {}; // Return an empty object or handle the error as needed
  }
}
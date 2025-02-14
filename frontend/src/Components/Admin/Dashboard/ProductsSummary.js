// src/components/Dashboard/ProductsSummary.js
import React, { useContext } from 'react';
import ProductContext from '../../../context/ProductContext/ProductContext';

const ProductsSummary = () => {
  const { products } = useContext(ProductContext);
  const totalProducts = products.length;

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">Products Overview</h2>
      <p>
        Total Products: <span className="font-semibold">{totalProducts}</span>
      </p>
    </div>
  );
};

export default ProductsSummary;

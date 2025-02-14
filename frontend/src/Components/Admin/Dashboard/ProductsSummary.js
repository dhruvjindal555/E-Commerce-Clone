// src/components/Dashboard/ProductsSummary.js
import React from 'react';

const ProductsSummary = () => {
  // Dummy data
  const totalProducts = 75;

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

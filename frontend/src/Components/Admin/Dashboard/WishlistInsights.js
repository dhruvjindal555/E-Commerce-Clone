// src/components/Dashboard/WishlistInsights.js
import React from 'react';

const WishlistInsights = () => {
  // Dummy data
  const mostWishlisted = [
    { product: 'Product A', count: 50 },
    { product: 'Product B', count: 35 },
    { product: 'Product C', count: 20 },
  ];

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">Wishlist Insights</h2>
      <ul className="mt-2">
        {mostWishlisted.map((item, index) => (
          <li key={index} className="text-sm">
            {item.product}: <span className="font-medium">{item.count} wishlists</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WishlistInsights;

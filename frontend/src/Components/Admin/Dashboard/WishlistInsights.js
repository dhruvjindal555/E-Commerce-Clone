// src/components/Dashboard/WishlistInsights.js
import React, { useContext, useEffect, useState, useRef } from 'react';
import WishlistContext from '../../../context/WishlistContext/WishlistContext';
import ProductContext from '../../../context/ProductContext/ProductContext';

const WishlistInsights = () => {
  const { products } = useContext(ProductContext);
  const { getAllWishlist } = useContext(WishlistContext);
  const [mostWishlisted, setMostWishlisted] = useState([]);

  useEffect(() => {
    const fetchAndCompute = async () => {
      try {
        const wishlists = await getAllWishlist(); // Expected to return an array of wishlists
        const counts = {};
        wishlists.forEach(wishlist => {
          wishlist.items.forEach(item => {
            // If items are populated as objects or are product IDs
            const prodId = item._id || item;
            counts[prodId] = (counts[prodId] || 0) + 1;
          });
        });
        // Map counts to product names using the products context
        const insights = Object.entries(counts).map(([prodId, count]) => {
          const product = products.find(p => p._id === prodId);
          // console.log(products);
          return {
            productName: product ? product.name : prodId,
            count,
          };
        });
        insights.sort((a, b) => b.count - a.count);
        setMostWishlisted(insights);
      } catch (error) {
        console.error('Error fetching wishlist insights:', error);
      }
    };


    fetchAndCompute();

  }, [getAllWishlist, products]);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">Wishlist Insights</h2>
      <ul className="mt-2">
        {mostWishlisted.map((item, index) => (
          <li key={index} className="text-sm">
            {item.productName}: <span className="font-medium">{item.count} wishlists</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WishlistInsights;

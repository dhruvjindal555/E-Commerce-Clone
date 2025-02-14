import React, { useState, useContext, useEffect } from 'react';
import CartContext from '../../context/CartContext/CartContext';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import WishlistContext from '../../context/WishlistContext/WishlistContext';
import { toast } from 'react-toastify';

const CartItem = ({ product, index }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const { removeFromCart, decrementQuantity, incrementQuantity } = useContext(CartContext);
  const handleLike = async () => {
    if (liked == true) {
      try {
        await removeFromWishlist(product._id)
        toast.success('Removed from wishlist')
      } catch (error) {
        toast.error('Failed to remove from wishlist')
        console.error("Error removing from wishlist:", error);
      }
    } else {
      try {
        await addToWishlist(product._id)
        toast.success('Added to wishlist')
      } catch (error) {
        toast.error('Failed to add to wishlist')
        console.error("Error adding to wishlist:", error);
      }
    }
  }
  useEffect(() => {
    // console.log('Wishlist changing');
    // console.log(wishlist)
    // Check if the current product exists in the wishlist using .some()
    const isLiked = wishlist.some((val) => {
      // console.log(String(val._id), String(product._id));
      return String(val._id) === String(product._id)
    });
    setLiked(isLiked);
  }, [wishlist, product._id]); // Run this effect when wishlist or product._id changes

  const handleClick = () => {
    navigate(`/${product.mainCategory}/${product.subCategory}/${product._id}`);
  };

  return (
    <div key={index} className="bg-white rounded-lg shadow p-3 mb-3">
      {/* Vertical layout on mobile; grid with 3 columns on desktop */}
      <div className="flex sm:flex-col md:grid md:grid-cols-3 gap-4">
        {/* Column 1: Product Image Carousel */}
        <div onClick={handleClick} className="cursor-pointer flex justify-center overflow-hidden">
          <Carousel
            stopOnHover
            infiniteLoop
            autoPlay
            showThumbs={false}
            interval={2000}
            className="w-32 h-32 md:w-48 md:h-48"
          >
            {product.images.map((url, idx) => (
              <div key={idx} className="flex justify-center items-center">
                <img
                  className="object-cover w-full h-full"
                  src={url}
                  alt={product.name}
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Column 2: Product Details */}
        <div className="mt-3 md:mt-0">
          <h2 onClick={handleClick} className="text-base md:text-lg font-semibold cursor-pointer">
            {product.name}
          </h2>
          <div className="flex items-center mt-1 gap-2">
            <span className="text-sm md:text-base font-bold">{product.brand}</span>
            <svg
              onClick={handleLike}
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer"
              height="20"
              width="20"
              viewBox="0 0 512 512"
            >
              <path
                fill={liked ? "#ff0000" : ""}
                d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
              />
            </svg>
          </div>
          {/* Extra details: only visible on desktop */}
          <div className="hidden md:block mt-2">
            <div className="flex items-center text-green-500">
              <span className="text-sm md:text-base">{product.rating}</span>
              <i className="fa-solid fa-star fa-xs md:fa-sm ml-1"></i>
            </div>
            <ul className="list-disc pl-4 mt-1 text-xs md:text-sm">
              {product.features.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3: Pricing and Quantity Controls */}
        <div className="mt-3 md:mt-0 text-right">
          <div className="text-lg md:text-2xl font-bold">₹{product.price}</div>
          <div className="line-through text-gray-500 text-sm md:text-base">₹{product.mrp}</div>
          <div className="text-green-500 text-sm md:text-base">Delivery: Free</div>
          {/* Extra details: only visible on desktop */}
          <div className="hidden md:block text-gray-500 text-xs md:text-sm">
            Est. Delivery Date: Thu Jul 25 2024
          </div>
          <div className="hidden md:block text-green-600 font-semibold text-sm md:text-base">
            Bank Offers Available
          </div>
          <div className="flex items-center justify-between mt-3 gap-4">
            <div className="flex items-center">
              <button
                onClick={() => decrementQuantity(product)}
                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs md:text-sm"
              >
                -
              </button>
              <input
                type="text"
                value={product.quantity}
                readOnly
                className="w-10 text-center border mx-1 text-xs md:text-sm"
              />
              <button
                onClick={() => incrementQuantity(product)}
                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs md:text-sm"
              >
                +
              </button>
            </div>
            <button onClick={() => removeFromCart(product)} className="text-red-500">
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

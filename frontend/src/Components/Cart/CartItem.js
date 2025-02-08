import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../../context/CartContext/CartContext';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';

const CartItem = ({ product, index }) => {
    const { removeFromCart, decrementQuantity, incrementQuantity } = useContext(CartContext)

    return (
        <div key={index} className="flex p-4 border-b border-gray-300">
            <div className="flex-shrink-0 overflow-hidden rounded-md mr-5">
                <Carousel stopOnHover infiniteLoop autoPlay showThumbs={false} interval={2000} className='w-48 h-48'>
                    {product.images.map((url, index) => {
                        return (<div className='flex justify-center items-center  ' key={index}>
                            <img

                                className=" object-cover"
                                src={url}
                                alt={product.name}
                            />
                        </div>
                        )
                    })}
                </Carousel>
            </div>
            <div className="flex flex-col justify-between flex-grow">
                <div className="flex-grow ml-4">
                    <div className="flex items-center mb-2">
                        <span className="text-xl font-bold">{product.brand}</span>
                        <button className="ml-2 text-gray-500">❤️</button>
                    </div>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <div className="flex items-center text-green-500 mb-2">
                        <span className="ml-1">{product.rating}</span>
                        <i className="fa-solid fa-star fa-sm px-1"></i>
                    </div>
                    <ul className="list-disc pl-5 mb-4">
                        {product.features.map((item, index) => {
                            return (<li key={index} className="">{item}</li>)
                        })}
                    </ul>
                </div>

            </div>
            <div className="flex-shrink-0 text-right ">
                <div className="text-2xl font-bold">{"₹" + product.price}</div>
                <div className="line-through text-gray-500">{"₹" + product.mrp}</div>
                <div className="text-green-500">Delivery: Free</div>
                <div className="text-gray-500">Est. Delivery Date: Thu Jul 25 2024</div>
                <div className="text-green-600 font-semibold">Bank Offers Available</div>

                <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center">
                        <button onClick={() => { console.log(decrementQuantity(product)) }} className="px-2 py-1 bg-gray-200 text-gray-700">-</button>
                        <input
                            type="text"
                            value={product.quantity}
                            readOnly
                            className="w-12 text-center border mx-2"
                        />
                        <button onClick={() => { console.log(incrementQuantity(product)) }} className="px-2 py-1 bg-gray-200 text-gray-700">+</button>
                    </div>
                    <button onClick={() => { removeFromCart(product) }} className="text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default CartItem
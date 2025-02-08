// CheckoutModal.js
import React, { useState } from 'react';

const CheckoutModal = ({ isOpen, onClose, product, quantity, setQuantity, couponCode, setCouponCode, onCheckout, deliveryMethod,
    setDeliveryMethod, paymentMethod, setPaymentMethod, deliveryCosts, }) => {


    if (!isOpen) return null; // Don't render anything if not open
    const totalPrice = (product.price * quantity + deliveryCosts[deliveryMethod]); // Calculate total price with delivery cost

    const handleQuantityChange = (value) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + value)); // Ensure quantity is at least 1
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

                {/* Product Information Section */}
                <div className="flex mb-6 border-b border-gray-200 pb-4">
                    <img src={product.images[0]} alt={product.name} className="w-32 h-32 object-cover mr-4 rounded" />
                    <div className='flex-grow'>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">Price: ₹{product.price}</p>
                        <div className="flex items-center mt-2">
                            <label htmlFor="quantity" className="mr-2 text-sm">Quantity:</label>
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l hover:bg-gray-400"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    id="quantity"
                                    value={quantity}
                                    readOnly
                                    className="border-t border-b border-gray-300 px-2 py-1 w-16 text-center"
                                    min="1"
                                />
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r hover:bg-gray-400"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 font-semibold">Total Price: ₹{totalPrice}</p>
                    </div>
                </div>

                {/* Delivery and Payment Method Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Delivery Method */}
                    <div>
                        <h4 className="font-semibold mb-2">Delivery Method:</h4>
                        <label className="block mb-1">
                            <input
                                type="radio"
                                value="Standard"
                                checked={deliveryMethod === 'Standard'}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                                className="mr-2"
                            />
                            Standard (Free)
                        </label>
                        <label className="block mb-1">
                            <input
                                type="radio"
                                value="Express"
                                checked={deliveryMethod === 'Express'}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                                className="mr-2"
                            />
                            Express (₹50)
                        </label>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h4 className="font-semibold mb-2">Payment Method:</h4>
                        <label className="block mb-1">
                            <input
                                type="radio"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mr-2"
                            />
                            Cash on Delivery
                        </label>
                        <label className="block mb-1">
                            <input
                                type="radio"
                                value="online"
                                checked={paymentMethod === 'online'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mr-2"
                            />
                            Online Payment
                        </label>
                    </div>
                </div>

                {/* Coupon Code Input */}
                <div className="mb-6">
                    <label htmlFor="coupon" className="block mb-1">Coupon Code:</label>
                    <input
                        type="text"
                        id="coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)} // Handle coupon code input
                        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Enter coupon code"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-auto">
                    <button
                        onClick={onCheckout}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out w-full mr-1"
                    >
                        Proceed to Checkout
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-200 ease-in-out w-full ml-1"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;

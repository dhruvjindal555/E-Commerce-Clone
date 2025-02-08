// OrderDetails.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderDetails = ({ order }) => {
    const navigate = useNavigate()
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Order ID: {"#"+order.orderId.split('-')[1]}</h3>
                <p className="text-md">Status: 
                    <span className={`font-bold ${order.orderStatus === 'Delivered' ? 'text-green-600' : 'text-red-600'}`}>
                        {order.orderStatus}
                    </span>
                </p>
                <p className="text-md">Shipping Method: {order.shippingMethod}</p>
                <p className="text-md">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>

                <h4 className="mt-6 text-lg font-semibold">Items Ordered:</h4>
                <table className="min-w-full mt-2 border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 text-left">Product Brand</th>
                            <th className="border px-4 py-2 text-left">Product Name</th>
                            <th className="border px-4 py-2 text-left">Quantity</th>
                            <th className="border px-4 py-2 text-left">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.itemsOrdered.map((item) => (
                            <tr  onClick={()=>navigate(`/${item.productId.mainCategory}/${item.productId.subCategory}/${item.productId._id}`)} key={item.productId._id} className="border-t hover:bg-gray-50 transition-colors cursor-pointer">
                                <td className="border px-4 py-2">{item.productId.brand}</td> 
                                <td className="border px-4 py-2">{item.productId.name}</td> 
                                <td className="border px-4 py-2">{item.quantity}</td>
                                <td className="border px-4 py-2">₹{item.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Total Price Calculation */}
                <div className="mt-6 flex justify-end">
                    <h4 className="font-semibold text-lg">Total Price: ₹{order.itemsOrdered.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h4>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

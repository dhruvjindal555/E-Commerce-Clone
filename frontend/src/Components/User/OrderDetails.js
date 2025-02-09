// OrderDetails.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderDetails = ({ order }) => {
  const navigate = useNavigate();

  // Common click handler for an order item
  const handleItemClick = (item) => {
    navigate(`/${item.productId.mainCategory}/${item.productId.subCategory}/${item.productId._id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-2 md:p-6">
      <div className="bg-white p-2 md:p-6 rounded-lg shadow-lg">
        <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2">
          Order ID: {"#" + order.orderId.split('-')[1]}
        </h3>
        <p className="text-sm md:text-lg mb-1">
          Status:{" "}
          <span
            className={`font-bold ${
              order.orderStatus === "Delivered" ? "text-green-600" : "text-red-600"
            }`}
          >
            {order.orderStatus}
          </span>
        </p>
        <p className="text-sm md:text-lg mb-1">Shipping Method: {order.shippingMethod}</p>
        <p className="text-sm md:text-lg mb-2">
          Order Date: {new Date(order.createdAt).toLocaleDateString()}
        </p>

        <h4 className="mt-4 text-base md:text-xl font-semibold">Items Ordered:</h4>

        {/* Mobile Layout: Card/List view for each item */}
        <div className="block md:hidden mt-2 space-y-2">
          {order.itemsOrdered.map((item) => (
            <div
              key={item.productId._id}
              onClick={() => handleItemClick(item)}
              className="bg-gray-50 p-2 rounded-md shadow cursor-pointer"
            >
              <p className="text-xs md:text-sm"><strong>Brand:</strong> {item.productId.brand}</p>
              <p className="text-xs md:text-sm"><strong>Name:</strong> {item.productId.name}</p>
              <p className="text-xs md:text-sm"><strong>Quantity:</strong> {item.quantity}</p>
              <p className="text-xs md:text-sm">
                <strong>Price:</strong> ₹{item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Layout: Table view for order items */}
        <div className="hidden md:block overflow-x-auto mt-2">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 md:px-4 md:py-2 text-left">
                  Product Brand
                </th>
                <th className="border px-2 py-1 md:px-4 md:py-2 text-left">
                  Product Name
                </th>
                <th className="border px-2 py-1 md:px-4 md:py-2 text-left">
                  Quantity
                </th>
                <th className="border px-2 py-1 md:px-4 md:py-2 text-left">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {order.itemsOrdered.map((item) => (
                <tr
                  key={item.productId._id}
                  onClick={() => handleItemClick(item)}
                  className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="border px-2 py-1 md:px-4 md:py-2">{item.productId.brand}</td>
                  <td className="border px-2 py-1 md:px-4 md:py-2">{item.productId.name}</td>
                  <td className="border px-2 py-1 md:px-4 md:py-2">{item.quantity}</td>
                  <td className="border px-2 py-1 md:px-4 md:py-2">
                    ₹{item.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Price Calculation */}
        <div className="mt-4 flex justify-end">
          <h4 className="font-semibold text-xs md:text-lg">
            Total Price: ₹
            {order.itemsOrdered
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

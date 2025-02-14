// src/components/Dashboard/OrdersSummary.js
import React from 'react';

const OrdersSummary = () => {
  // Dummy data; replace with API data from your context
  const totalOrders = 150;
  const totalRevenue = 50000; // in dollars
  const ordersPerStatus = {
    Pending: 20,
    Shipped: 60,
    Delivered: 65,
    Cancelled: 5,
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">Orders Summary</h2>
      <p>
        Total Orders: <span className="font-semibold">{totalOrders}</span>
      </p>
      <p>
        Total Revenue: <span className="font-semibold">${totalRevenue}</span>
      </p>
      <div className="mt-2">
        <h3 className="font-semibold">Orders by Status:</h3>
        <ul className="mt-1">
          {Object.entries(ordersPerStatus).map(([status, count]) => (
            <li key={status} className="text-sm">
              {status}: <span className="font-medium">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersSummary;

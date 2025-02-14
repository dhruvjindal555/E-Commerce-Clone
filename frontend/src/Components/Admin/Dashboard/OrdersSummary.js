// src/components/Dashboard/OrdersSummary.js
import React, { useContext, useEffect, useState } from 'react';
import OrdersContext from '../../../context/OrderContext/OrderContext';

const OrdersSummary = () => {
  const { orders } = useContext(OrdersContext);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    ordersPerStatus: { Pending: 0, Shipped: 0, Delivered: 0, Cancelled: 0 },
  });

  useEffect(() => {
    if (orders && orders.length > 0) {
      let totalRevenue = 0;
      const ordersPerStatus = { Pending: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
      orders.forEach(order => {
        ordersPerStatus[order.orderStatus] = (ordersPerStatus[order.orderStatus] || 0) + 1;
        // Calculate revenue from each order’s items
        const orderTotal = order.itemsOrdered.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );
        totalRevenue += orderTotal;
      });

      setSummary({
        totalOrders: orders.length,
        totalRevenue,
        ordersPerStatus,
      });
    }
  }, [orders]);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">Orders Summary</h2>
      <p>
        Total Orders: <span className="font-semibold">{summary.totalOrders}</span>
      </p>
      <p>
        Total Revenue: <span className="font-semibold">₹{summary.totalRevenue.toFixed(2)}</span>
      </p>
      <div className="mt-2">
        <h3 className="font-semibold">Orders by Status:</h3>
        <ul className="mt-1">
          {Object.entries(summary.ordersPerStatus).map(([status, count]) => (
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

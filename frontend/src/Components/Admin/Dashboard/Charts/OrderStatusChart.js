// src/components/Dashboard/Charts/OrderStatusChart.js
import React, { useContext, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import OrdersContext from '../../../../context/OrderContext/OrderContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusChart = () => {
  const { orders } = useContext(OrdersContext);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const statusCounts = { Pending: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach(order => {
      statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
    });
    const labels = Object.keys(statusCounts);
    const data = labels.map(label => statusCounts[label]);
    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#fbbf24', '#3b82f6', '#10b981', '#ef4444'],
          hoverBackgroundColor: ['#f59e0b', '#2563eb', '#059669', '#dc2626'],
        },
      ],
    });
  }, [orders]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Order Status Breakdown' },
    },
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default OrderStatusChart;

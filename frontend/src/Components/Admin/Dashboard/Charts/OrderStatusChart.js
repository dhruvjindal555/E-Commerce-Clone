// src/components/Dashboard/Charts/OrderStatusChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusChart = () => {
  // Dummy order status data
  const data = {
    labels: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [20, 60, 65, 5],
        backgroundColor: ['#fbbf24', '#3b82f6', '#10b981', '#ef4444'],
        hoverBackgroundColor: ['#f59e0b', '#2563eb', '#059669', '#dc2626'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Order Status Breakdown' },
    },
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <Pie data={data} options={options} />
    </div>
  );
};

export default OrderStatusChart;

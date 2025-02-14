// src/components/Dashboard/Charts/ProductPerformanceChart.js
import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import OrdersContext from '../../../../context/OrderContext/OrderContext';
import ProductContext from '../../../../context/ProductContext/ProductContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductPerformanceChart = () => {
  const { orders } = useContext(OrdersContext);
  const { products } = useContext(ProductContext);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Aggregate revenue by product
    const revenueByProduct = {};
    orders.forEach(order => {
      order.itemsOrdered.forEach(item => {
        // Access the product id (assuming item.productId is populated)
        const prodId = item.productId._id;
        const itemRevenue = item.price * item.quantity;
        revenueByProduct[prodId] = (revenueByProduct[prodId] || 0) + itemRevenue;
      });
    });

    // Map aggregated revenue to product names (first 3 characters)
    const labels = [];
    const data = [];
    Object.entries(revenueByProduct).forEach(([prodId, revenue]) => {
      const product = products.find(p => p._id === prodId);
      // Truncate product name to the first 3 characters
      labels.push(product ? product.name.substring(0, 15)+"..." : prodId.substring(0, 3));
      data.push(revenue);
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Sales',
          data,
          backgroundColor: '#3b82f6',
        },
      ],
    });
  }, [orders]);

  // Chart options including vertical x-axis labels
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill the container height
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Product Performance' },
      tooltip: {
        callbacks: {
          label: (context) => `Sales: ₹${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '₹' + value,
        },
      },
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 90,
          autoSkip: false,
        },
      },
    },
  };

  return (
    // Responsive container with increased height on small screens
    <div className="bg-white shadow rounded p-4 h-[400px] sm:h-[500px] md:h-[600px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ProductPerformanceChart;

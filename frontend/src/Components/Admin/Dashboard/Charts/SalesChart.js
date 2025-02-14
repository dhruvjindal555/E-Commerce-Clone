// src/components/Dashboard/Charts/SalesChart.js
import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import OrdersContext from '../../../../context/OrderContext/OrderContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const { orders } = useContext(OrdersContext);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Define month order so that all months are displayed even if revenue is zero
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Initialize revenue for each month
    const revenueByMonth = {};
    monthOrder.forEach(month => {
      revenueByMonth[month] = 0;
    });
    
    // Aggregate revenue from orders
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      const orderRevenue = order.itemsOrdered.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );
      revenueByMonth[month] += orderRevenue;
    });

    // Prepare chart data in the defined month order
    const labels = monthOrder;
    const data = monthOrder.map(month => revenueByMonth[month]);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Sales',
          data,
          fill: false,
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          tension: 0.1,
        },
      ],
    });
  }, [orders]);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fill the container height
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sales Over Time' },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            return `Sales: ₹${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          },
        },
      },
    },
  };

  return (
    // Responsive container with increased height for better detail on small screens
    <div className="bg-white shadow rounded p-4 h-[300px] sm:h-[400px] md:h-[500px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;

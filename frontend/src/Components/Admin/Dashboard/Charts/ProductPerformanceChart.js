// src/components/Dashboard/Charts/ProductPerformanceChart.js
import React from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductPerformanceChart = () => {
  // Dummy product performance data
  const data = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    datasets: [
      {
        label: 'Sales',
        data: [500, 300, 400, 200, 600],
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Product Performance' },
    },
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ProductPerformanceChart;

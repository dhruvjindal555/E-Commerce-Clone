// src/components/Dashboard/Charts/SalesChart.js
import React from 'react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  // Dummy sales data
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales',
        data: [3000, 4000, 3200, 5000, 4500, 6000, 7000],
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sales Over Time' },
    },
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesChart;

// src/components/Dashboard/Dashboard.js
import React, { useContext } from 'react';
import OrdersSummary from './OrdersSummary';
import UsersSummary from './UsersSummary';
import ProductsSummary from './ProductsSummary';
import ReviewsSummary from './ReviewsSummary';
import WishlistInsights from './WishlistInsights';
import SalesChart from './Charts/SalesChart';
import OrderStatusChart from './Charts/OrderStatusChart';
import ProductPerformanceChart from './Charts/ProductPerformanceChart';
import LoadingContext from '../../../context/LoadingContext/LoadingContext'
import LoadingPage from '../../LoadingPage'

const Dashboard = () => {

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Dukaan Dashboard</h1>
      
      {/* Top Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OrdersSummary />
        <UsersSummary />
      </div>
      
      {/* Middle Summaries */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductsSummary />
        <ReviewsSummary />
      </div>
      
      <div className="mt-4">
        <WishlistInsights />
      </div>
      
      {/* Charts */}
      <div className="mt-8">
        <SalesChart />
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <OrderStatusChart />
        <ProductPerformanceChart />
      </div>
    </div>
  );
};

export default Dashboard;

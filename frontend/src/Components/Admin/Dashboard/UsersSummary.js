// src/components/Dashboard/UsersSummary.js
import React from 'react';

const UsersSummary = () => {
  // Dummy data; update with your API integration later
  const totalUsers = 200;
  const recentSignups = 15;
  const activeUsers = 120;

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">User Summary</h2>
      <p>
        Total Registered Users: <span className="font-semibold">{totalUsers}</span>
      </p>
      <p>
        Recent Signups: <span className="font-semibold">{recentSignups}</span>
      </p>
      <p>
        Active Users: <span className="font-semibold">{activeUsers}</span>
      </p>
    </div>
  );
};

export default UsersSummary;

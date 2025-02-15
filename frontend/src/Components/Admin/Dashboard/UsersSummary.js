// src/components/Dashboard/UsersSummary.js
import React, { useState, useEffect } from 'react';

const UsersSummary = () => {
  const [userSummary, setUserSummary] = useState({
    totalUsers: 0,
    recentSignups: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = window.localStorage.getItem('authToken');
        const response = await fetch('https://apni-dukaan-3555.onrender.com/user/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authToken': token,
          },
        });
        const data = await response.json();
        if (data.success && data.users) {
          const users = data.users;
          const totalUsers = users.length;
          // Consider recent signups as those registered in the last 7 days
          const recentSignups = users.filter(user => {
            return (new Date() - new Date(user.date)) < (7 * 24 * 60 * 60 * 1000);
          }).length;
          // Active users: those with lastLoginDate within the last 30 days
          const activeUsers = users.filter(user => {
            return user.lastLoginDate && ((new Date() - new Date(user.lastLoginDate)) < (30 * 24 * 60 * 60 * 1000));
          }).length;
          setUserSummary({ totalUsers, recentSignups, activeUsers });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">User Summary</h2>
      <p>
        Total Registered Users: <span className="font-semibold">{userSummary.totalUsers}</span>
      </p>
      <p>
        Recent Signups: <span className="font-semibold">{userSummary.recentSignups}</span>
      </p>
      <p>
        Active Users: <span className="font-semibold">{userSummary.activeUsers}</span>
      </p>
    </div>
  );
};

export default UsersSummary;

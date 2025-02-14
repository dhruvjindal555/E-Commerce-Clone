// src/components/Dashboard/ReviewsSummary.js
import React, { useEffect, useState } from 'react';

const ReviewsSummary = () => {
  const [reviewData, setReviewData] = useState({ averageRating: 0, totalReviews: 0 });
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = window.localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8888/review', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authToken': token,
          },
        });
        const data = await response.json();
        if (data) {
          // console.log(data);
          
          const reviews = data;
          const totalReviews = reviews.length;
          const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalReviews > 0 ? (sumRatings / totalReviews) : 0;
          setReviewData({ averageRating, totalReviews });
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">Reviews Summary</h2>
      <p>
        Average Product Rating: <span className="font-semibold">{reviewData.averageRating.toFixed(1)}</span>
      </p>
      <p>
        Total Reviews: <span className="font-semibold">{reviewData.totalReviews}</span>
      </p>
    </div>
  );
};

export default ReviewsSummary;

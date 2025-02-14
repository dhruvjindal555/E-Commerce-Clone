// src/components/Dashboard/ReviewsSummary.js
import React from 'react';

const ReviewsSummary = () => {
  // Dummy data; replace later with actual API data
  const averageRating = 4.2;
  const totalReviews = 320;

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">Reviews Summary</h2>
      <p>
        Average Product Rating: <span className="font-semibold">{averageRating}</span>
      </p>
      <p>
        Total Reviews: <span className="font-semibold">{totalReviews}</span>
      </p>
    </div>
  );
};

export default ReviewsSummary;

// ReviewsList.jsx
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LoadingContext from '../../context/LoadingContext/LoadingContext';

function ReviewsList({ productId, currentUserId, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const { setLoading } = useContext(LoadingContext);

  // Function to fetch reviews from the backend.
  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8888/review/${productId}`);
      const data = await response.json();
      if (response.ok) {
        setReviews(data);
      } else {
        toast.error("Failed to load reviews.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error.");
    }
  };

  useEffect(() => {
    fetchReviews();
    // Re-fetch when the productId or refreshTrigger changes.
  }, [productId, refreshTrigger]);

  // Function to handle deletion of a review.
  const handleDelete = async (reviewId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8888/review/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authToken': token,
        },
      });
      setLoading(false);
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchReviews(); // Refresh reviews after deletion.
      } else {
        toast.error(data.message || "Failed to delete review.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error.");
    }
  };

  return (
    <div className="mt-6 sm:px-4">
      <h3 className="text-lg font-bold mb-4">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="border p-4 rounded mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="w-full">
                <h4 className="font-bold text-lg">{review.title}</h4>
                <div className="flex items-center mt-1">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <svg
                        key={index}
                        className={`w-5 h-5 ${index < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .288l2.833 8.718H24l-7.176 5.215L19.833 24 12 18.285 4.167 24 7.176 14.221 0 8.006h9.167z" />
                      </svg>
                    ))}
                </div>
                <p className="text-gray-600 mt-2">{review.description}</p>
                {/* Render images if available */}
                {review.images && review.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Review Image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
              {currentUserId === review.user?._id && (
                <button
                  onClick={() => handleDelete(review._id)}
                  className="mt-2 border border-red-300 p-1 rounded-md md:p-3 md:py-2 md:mt-0 text-red-600 ml-0 md:ml-4 whitespace-nowrap"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Reviewed {review.user?.fullName.length >1 ? 'by':""} {review.user?.fullName} on {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewsList;

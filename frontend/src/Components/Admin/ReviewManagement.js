import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";


const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [filterRating, setFilterRating] = useState("");

  const deleteReview = async (id) => {
    try {
      const response = await fetch(`http://localhost:8888/review/${id}`, {
        method: 'DELETE',
        headers: {
          'authToken': window.localStorage.getItem('authToken')
        }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Error deleting review")
      }
      setReviews(reviews.filter((review) => review._id !== id));
      toast.success("Review deleted successfully");
      
    } catch (error) {
      toast.error(error.message);
      console.error(error)
    }  
  };



  useEffect(() => {
    try {
      const fetchReviews = async () => {
        const response = await fetch('http://localhost:8888/review', {
          method: 'GET',
          headers: {
            'authToken': window.localStorage.getItem('authToken')
          }
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || "Error fetching all reviews")
        }
        console.log(data);
        setReviews(data)
      }
      fetchReviews()
    } catch (error) {
      toast.error(error.message);
      console.error(error)
    }
  }, [])
  const filteredReviews = reviews.filter(
    (review) =>
      (searchUser ? review.user.fullName.toLowerCase().includes(searchUser.toLowerCase()) : true) &&
      (searchProduct ? review.product?.name.toLowerCase().includes(searchProduct.toLowerCase()) : true) &&
      (filterRating ? review.rating === Number(filterRating) : true)
  );
  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Review Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by User"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Search by Product"
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <div key={review._id} className="border p-4 rounded shadow-md bg-white">
            <h3 className="text-lg font-semibold">{review.title}</h3>
            <p className="text-sm text-gray-600">Product: {review.product?.name}</p>
            <p className="text-sm text-gray-600">User: {review.user.fullName}</p>
            <p className="mt-2 text-gray-800">{review.description}</p>
            <div className="flex items-center my-2">
              <span className="font-bold">Rating:</span>
              <span className="ml-2 text-yellow-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {review.images.length > 0 && review.images.map((img, idx) => (
                <img key={idx} src={img.url} alt="Review" className="w-32 h-32 rounded-lg" />
              ))}
            </div>
            <button
              onClick={() => deleteReview(review._id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewManagement;

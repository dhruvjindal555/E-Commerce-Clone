import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import LoadingContext from '../../context/LoadingContext/LoadingContext';
import LoadingPage from '../LoadingPage';

function Review({ show, setShow, productId, onReviewAdded }) {
  const { loading, setLoading } = useContext(LoadingContext);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Triggered when the file input changes.
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Always convert to an array.
    if (files.length > 3) {
      toast.error("Only 3 photos can be uploaded at most.");
      setSelectedFiles(files.slice(0, 3));
    } else {
      setSelectedFiles(files);
    }
  };

  // When a star is clicked, update the rating.
  const handleStarClick = (star) => {
    setRating(star);
  };

  // Submit the review form.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }

    // Create a FormData instance for sending files (if any)
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", rating);
    formData.append("title", title);
    formData.append("description", description);

    // Append each selected file (if any)
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // Get your JWT token (or however you manage auth)
      const token = localStorage.getItem('authToken');
      setLoading(true);
      const response = await fetch('http://localhost:8888/review', {
        method: 'POST',
        headers: {
          // Do not set the Content-Type header when sending FormData!
          'authToken': token,
        },
        body: formData,
      });

      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        toast.success(data.message);
        setShow(false);
        document.body.style.overflow = 'unset';
        // Notify the parent so it can refresh the reviews list.
        if (onReviewAdded) onReviewAdded();
      } else {
        toast.error(data.message || "Failed to add review.");
      }
    } catch (error) {
      document.body.style.overflow = 'unset';
      console.error(error);
      toast.error("Server error.");
    }
  };

  // Show a loading page if the form is in a loading state.
  if (loading) return <LoadingPage />;

  // If the modal should not be shown, return null.
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-25">
      <div className="bg-white w-full max-w-2xl p-4 md:p-6 rounded-lg shadow-md relative mx-2">
        <button
          onClick={() => {
            document.body.style.overflow = 'unset';
            setShow(false);
          }}
          className="absolute top-2 right-2 text-red-600 text-2xl"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Ratings and Reviews</h2>
          <span className="text-red-600 mt-2 md:mt-0">Review this Product</span>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Rate your product</label>
            <div className="flex space-x-1">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <svg
                    key={index}
                    onClick={() => handleStarClick(index + 1)}
                    className={`w-6 h-6 cursor-pointer ${
                      index < rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .288l2.833 8.718H24l-7.176 5.215L19.833 24 12 18.285 4.167 24 7.176 14.221 0 8.006h9.167z" />
                  </svg>
                ))}
            </div>
          </div>

          {/* Title and Description */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Review Your Product</label>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              placeholder="Title of your review ..."
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Add description for your product ..."
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* File upload and preview */}
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-2 bg-blue-100 text-blue-500 py-1 rounded-full inline-block"
            >
              <i className="fa-regular fa-image"></i> Upload Images (Max 3)
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <img
                      key={index}
                      src={previewUrl}
                      alt={`Preview ${index}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit button */}
          <div className="mb-4 flex justify-center">
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
              Add Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Review;

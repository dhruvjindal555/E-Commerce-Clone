import React, { useContext, useEffect, useState } from "react";
import ProductManagementModal from "./ProductManagementModal";
import ProductCard from "./ProductCard";
import LoadingPage from "../../LoadingPage";
import ProductContext from "../../../context/ProductContext/ProductContext";
import LoadingContext from "../../../context/LoadingContext/LoadingContext";
import { toast } from "react-toastify";

const ProductManagement = () => {
  // Dummy product data
  const { products, createProduct, updateProduct, deleteProduct } = useContext(ProductContext);
  const { loading } = useContext(LoadingContext)

  // Filtering state (including new search filter by product name)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });

  // Modal and edit state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state for product details in modal
  const [formData, setFormData] = useState({
    mainCategory: "",
    subCategory: "",
    name: "",
    price: "",
    mrp: "",
    description: "",
    features: "",
    rating: "",
    color: "",
    images: [],
  });

  // Store image preview URLs (or existing image URLs when editing)
  const [imagePreviews, setImagePreviews] = useState([]);

  // Filtering handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters on the products array
  const filteredProducts = products.filter((product) => {
    // Search filter: check if product name includes the search string
    if (filters.search) {
      if (
        !product.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
    }
    // Category filter: check main or sub category (case insensitive)
    if (filters.category) {
      const catFilter = filters.category.toLowerCase();
      if (
        !product.mainCategory.toLowerCase().includes(catFilter) &&
        !product.subCategory.toLowerCase().includes(catFilter)
      ) {
        return false;
      }
    }
    // Price range filter (price is stored as string; we parse it)
    const price = parseFloat(product.price);
    if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
    // Rating filter: if product rating is below filter value, filter it out
    if (filters.rating && parseFloat(product.rating) < parseFloat(filters.rating))
      return false;
    return true;
  });

  // Handle input changes for form fields in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection for multiple images
  const handleImageChange = (e) => {
    // const prevImages = formData.images
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    // console.log([...previews, ...prevImages]);    
    setFormData((prev) => ({ ...prev, images: files}));
    setImagePreviews(previews);
  };

  // Remove a selected image from previews
  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  // Handle form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const featuresArray = formData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);

    if (editingProduct) {
      const newProduct = {
        ...formData,
        features: featuresArray,
      };
      console.log(editingProduct._id, newProduct);
      try {
        await updateProduct(editingProduct._id, newProduct)
        toast.success("Sucessfully updated the product")
      } catch (error) {
        toast.error(error.message)
      }
    } else {
      const newProduct = {
        ...formData,
        features: featuresArray,
      };
      console.log(newProduct);
      try {
        await createProduct(newProduct)
        toast.success("Sucessfully created the product")
      } catch (error) {
        toast.error(error.message)
      }
    }
    // Reset form and close modal
    setFormData({
      mainCategory: "",
      subCategory: "",
      name: "",
      price: "",
      mrp: "",
      description: "",
      features: "",
      rating: "",
      color: "",
      images: [],
    });
    setImagePreviews([]);
    setEditingProduct(null);
    setShowModal(false);
  };

  // Open modal in edit mode with prefilled values
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      description: product.description,
      features: product.features.join(", "),
      rating: product.rating,
      color: product.color,
      images: product.images,
    });
    setImagePreviews(product.images);
    setShowModal(true);
  };

  // Delete a product with confirmation
  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        await deleteProduct(productId)
        toast.success('Deleted Successfully')
      }
    } catch (error) {
      toast.error(error)
    }
  };

  // Close modal and reset form state
  const handleCancel = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      mainCategory: "",
      subCategory: "",
      name: "",
      price: "",
      mrp: "",
      description: "",
      features: "",
      rating: "",
      color: "",
      images: [],
    });
    setImagePreviews([]);
  };

  if (loading) return <LoadingPage />
  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Product Management
        </h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingProduct(null);
            setFormData({
              mainCategory: "",
              subCategory: "",
              name: "",
              price: "",
              mrp: "",
              description: "",
              features: "",
              rating: "",
              color: "",
              images: [],
            });
            setImagePreviews([]);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Add New Product
        </button>
      </div>

      {/* Filtering UI */}
      <div className="mb-6 p-4 bg-gray-50 rounded shadow">
        <h4 className="text-lg font-semibold mb-2">Filter Products</h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div>
            <label className="block text-gray-700">Search Name</label>
            <input
              type="text"
              name="search"
              placeholder="Search by name"
              value={filters.search}
              onChange={handleFilterChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              placeholder="Main or Sub category"
              value={filters.category}
              onChange={handleFilterChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Min Price</label>
            <input
              type="number"
              name="minPrice"
              placeholder="e.g., 500"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              placeholder="e.g., 1500"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Min Rating</label>
            <input
              type="number"
              step="0.1"
              name="rating"
              placeholder="e.g., 4.0"
              value={filters.rating}
              onChange={handleFilterChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <ProductCard
        filteredProducts={filteredProducts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Responsive Modal for Create/Edit */}
      {showModal && (
        <ProductManagementModal
          formData={formData}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          imagePreviews={imagePreviews}
          editingProduct={editingProduct}
          handleRemoveImage={handleRemoveImage}
          handleImageChange={handleImageChange}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default ProductManagement;

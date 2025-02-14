import React from 'react'

function ProductManagementModal({
    formData,
    handleCancel,
    handleSubmit,
    imagePreviews,
    editingProduct,
    handleImageChange,
    handleInputChange,
    handleRemoveImage
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-full sm:h-auto overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-2xl font-bold">
                        {editingProduct ? "Edit Product" : "New Product"}
                    </h3>
                    <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-800 text-3xl"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        {/* Left Column: Image Upload & Previews */}
                        <div className="md:w-1/2 mb-4 md:mb-0">
                            <label className="block text-gray-700 font-medium mb-2">
                                Images
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="mb-2"
                            />
                            <div className="grid grid-cols-3 gap-2">
                                {imagePreviews.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img}
                                            alt={`Preview ${index}`}
                                            className="w-full h-24 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Right Column: Product Details Form */}
                        <div className="md:w-1/2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700">Main Category</label>
                                    <input
                                        type="text"
                                        name="mainCategory"
                                        value={formData.mainCategory}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Sub Category</label>
                                    <input
                                        type="text"
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Price</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">MRP</label>
                                    <input
                                        type="text"
                                        name="mrp"
                                        value={formData.mrp}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Rating</label>
                                    <input
                                        type="text"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Color</label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border rounded w-full"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="mt-1 p-2 border rounded w-full"
                                ></textarea>
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">
                                    Features (comma separated)
                                </label>
                                <input
                                    type="text"
                                    name="features"
                                    value={formData.features}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Modal Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            {editingProduct ? "Update Product" : "Create Product"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductManagementModal
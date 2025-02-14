import React from 'react'
import { Carousel } from 'react-responsive-carousel';

function ProductCard({ filteredProducts, handleEdit, handleDelete }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
                <div
                    key={product._id}
                    className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
                >
                    {/* Product Image */}
                    <Carousel
                        stopOnHover
                        infiniteLoop
                        autoPlay
                        showThumbs={false}
                        interval={2000}
                        className='h-48 w-full overflow-hidden'
                    >
                        {product.images.length > 0 ? product.images.map((url, index) => (
                            <div key={index} className="flex justify-center items-center bg-contain">
                                <img
                                    className="object-contain max-h-48 rounded-lg"
                                    src={url}
                                    alt={product.name}
                                />
                            </div>
                        )) :
                            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                                No Image
                            </div>
                        }
                    </Carousel>
                    {/* Product Details */}
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                        <p className="text-gray-600">
                            <span className="font-semibold">Category:</span>{" "}
                            {product.mainCategory} / {product.subCategory}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Price:</span> ₹{product.price}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">MRP:</span> ₹{product.mrp}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Rating:</span> {product.rating}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Color:</span> {product.color}
                        </p>
                        <p className="text-gray-600 mt-2">{product.description}</p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Features:</span>{" "}
                            {product.features.join(", ")}
                        </p>
                        {/* Action Buttons */}
                        <div className="mt-auto flex justify-end space-x-2 pt-4">
                            <button
                                onClick={() => handleEdit(product)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductCard
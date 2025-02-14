import React, { useContext, useEffect, useState } from 'react'
import ProductContext from '../ProductContext/ProductContext'
import LoadingContext from '../LoadingContext/LoadingContext'

function ProductState({ children }) {
    const { setLoading } = useContext(LoadingContext);
    const [products, setProducts] = useState([])
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch('http://localhost:8888/product/getAllProduct', {
                mathod: "GET"
            })
            const data = await response.json()
            setLoading(false)

            if (!response.ok) {
                throw new Error(data.error)
            }
            console.log(data);
            setProducts(data.data)
        } catch (error) {
            console.error(error.message)
        }
    }


    // Create a new product using multipart/form-data
    const createProduct = async (productData) => {
        try {
            const formData = new FormData();
            console.log(productData);            
            // console.log(Object.keys(productData));

            // Append all product text fields
            Object.keys(productData).forEach((key) => {
                if (key !== 'features') { formData.append(key, productData[key]); }
            });
            // console.log(formData);
            formData.append('features', JSON.stringify(productData.features));

            // Append files (only up to 5 files)
            if (productData.images && productData.images.length > 0) {
                Array.from(productData.images)
                    .slice(0, 5)
                    .forEach((file) => formData.append('productImages', file));
            }

            setLoading(true)
            const res = await fetch('http://localhost:8888/product', {
                method: "POST",
                headers: {
                    'authToken': window.localStorage.getItem('authToken')
                },
                body: formData
            });
            const data = await res.json();
            setLoading(false)
            if (res.ok) {
                setProducts((prev) => [...prev, data.data]);
                return { success: true, data: data.data };
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            console.error('Error creating product:', error.message);
            throw new Error(error)
        }
    };

    // Update an existing product
    const updateProduct = async (id, productData) => {
        try {
            const formData = new FormData();
            console.log(productData);        
            Object.keys(productData).forEach((key) => {
                if (key !== 'features') { formData.append(key, productData[key]); }
            });
            formData.append('features', JSON.stringify(productData.features));


            if (productData.images && productData.images.length > 0) {
                Array.from(productData.images)
                    .slice(0, 5)
                    .forEach((file) => formData.append('productImages', file));
            }

            setLoading(true)
            const res = await fetch(`http://localhost:8888/product/${id}`, {
                method: "PUT",
                headers: {
                    'authToken': window.localStorage.getItem('authToken')
                },
                body: formData
            });
            const data = await res.json();
            setLoading(false)

            if (data.success) {
                setProducts((prev) =>
                    prev.map((prod) => (prod._id === id ? data.data : prod))
                );
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            console.error('Error updating product:', error);
            throw new Error(error.response ? error.response.data : error.message)
        }
    };

    // Delete a product
    const deleteProduct = async (id) => {
        try {
            setLoading(true)
            const res = await fetch(`http://localhost:8888/product/${id}`, {
                method: 'DELETE',
                headers: {
                    'authToken': window.localStorage.getItem('authToken')
                },
            });
            const data = await res.json();
            setLoading(false)

            if (!res.ok) {
                throw new Error(data.message)
            }

            if (data.success) {
                setProducts((prev) => prev.filter((prod) => prod._id !== id));
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            throw new Error(error.response ? error.response.data : error.message)
        }
    };

    useEffect(() => {
        getAllProducts();
    }, [setLoading])
    return (
        <ProductContext.Provider
            value={{
                products,
                createProduct,
                updateProduct,
                deleteProduct
            }}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductState
// OrdersContext.js
import React, { useContext, useEffect, useState } from 'react';
import { fetchOrders, createOrder, updateOrder, deleteOrder } from './api'; // Adjust the import path as necessary
import OrdersContext from '../OrderContext/OrderContext'
import LoadingContext from '../LoadingContext/LoadingContext';

function OrdersState({ children }) {
    const [orders, setOrders] = useState([]);
    const {loading, setLoading} = useContext(LoadingContext);
    const [error, setError] = useState(null);
    // const [newOrderData, setNewOrderData] = useState({})
    // const [orderIdToUpdate, setOrderIdToUpdate] = useState(null); // State for order ID to update

    // Fetch orders on component mount
    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await fetchOrders();
            console.log('Fetching Orders', data);
            setOrders(data.orders);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadOrders();
    }, []);

    // Function to handle creating a new order
    const handleCreateOrder = async (newOrderData) => {
        try {
            setLoading(true);
            const createdOrder = await createOrder(newOrderData);
            setLoading(false);
            setOrders((prevOrders) => [...prevOrders, createdOrder.newOrder]);
            loadOrders(); // Reload orders after creating a new one
            return createdOrder
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    // Function to handle updating an existing order
    const handleUpdateOrder = async (orderIdToUpdate,newOrderData) => {
        if (!orderIdToUpdate) return; // Ensure there is an order ID to update
        try {
            setLoading(true);
            console.log("newOrderData",newOrderData);            
            const updatedOrder = await updateOrder(orderIdToUpdate, newOrderData);
            setLoading(false);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === updatedOrder.updatedOrder._id ? updatedOrder.updatedOrder : order
                )
            );
            await loadOrders(); // Reload orders after updating
        } catch (err) {
            throw new Error(err)
        }
    };

    // Function to handle deleting an order
    const handleDeleteOrder = async (orderId) => {
        try {
            setLoading(true);
            await deleteOrder(orderId);
            setLoading(false);
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            await loadOrders(); // Reload orders after deleting
        } catch (err) {
            throw new Error (err)
        }
    };

    return (
        <OrdersContext.Provider value={{
            orders,
            loading,
            error,
            handleCreateOrder,
            handleUpdateOrder,
            handleDeleteOrder,
        }}>
            {children}
        </OrdersContext.Provider>
    );
};
export default OrdersState
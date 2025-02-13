const mongoose = require('mongoose');
const Order = require('../Models/OrderSchema');
const User = require('../Models/UserSchema');
const sendOrderConfirmationEmail = require('../utils/sendOrderConfirmationEmail');

const createOrder = async (req, res) => {
    try {
        // Generate a unique order ID (you can customize this logic)
        const user = await User.findById(req.user.id)
        const newOrder = new Order({
            userId: req.user.id,
            orderId: `ORD-${Date.now()}`,  // Example of generating a unique order ID
            ...req.body  // Spread operator to include other fields from request body
        })
        await newOrder.save();
        const order = await newOrder.populate('itemsOrdered.productId');
        console.log(order);
        if (user.email) await sendOrderConfirmationEmail(user.email, order);
        else throw new Error("User email not found");
        res.status(201).json({ success: true, newOrder });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
const getAllOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (user.role === 'admin') {
            const orders = await Order.find().populate('itemsOrdered.productId');
            return res.status(200).json({ success: true, orders });
        }
        const orders = await Order.find({ userId: user._id }).populate('itemsOrdered.productId');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getOrder = async (req, res) => {
    try {
        const order = await Order.find({ orderId: "ORD-" + req.params.id, userId: req.user.id })
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const updateOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: "ORD-" + req.params.id })
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        const updatedOrder = await Order.findByIdAndUpdate(order._id, req.body, { new: true });
        res.status(200).json({ success: true, updatedOrder });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: "ORD-" + req.params.id })
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        const deletedOrder = await Order.findByIdAndDelete(order._id);
        res.status(200).json({ success: true, message: "Deleted Sucessfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { createOrder, getAllOrders, getOrder, updateOrder, deleteOrder }
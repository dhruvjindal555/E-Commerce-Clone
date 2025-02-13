import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import OrderContext from "../../context/OrderContext/OrderContext";

const OrderManagement = () => {
  const { orders, handleUpdateOrder, handleDeleteOrder } = useContext(OrderContext);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterShipping, setFilterShipping] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const updateOrderStatus = async (order, status) => {
    try {
      const id = order.orderId.split('-')[1];
      await handleUpdateOrder(id, {
        itemsOrdered: order.itemsOrdered,
        orderStatus: status,
        shippingMethod: order.shippingMethod,
      });
      toast.success("Order updated successfully");
    } catch (error) {
      toast.error("Error updating order");
    }
  };

  const updateShippingMethod = async (order, shippingMethod) => {
    try {
      const id = order.orderId.split('-')[1];
      await handleUpdateOrder(id, {
        itemsOrdered: order.itemsOrdered,
        orderStatus: order.orderStatus,
        shippingMethod,
      });
      toast.success("Shipping method updated successfully");
    } catch (error) {
      toast.error("Error updating shipping method");
    }
  };

  const deleteOrder = async (order) => {
    try {
      const id = order.orderId.split('-')[1];
      await handleDeleteOrder(id);
      toast.success("Order deleted successfully");
    } catch (error) {
      toast.error("Error deleting order");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.includes(search) &&
      (filterStatus ? order.orderStatus === filterStatus : true) &&
      (filterShipping ? order.shippingMethod === filterShipping : true) &&
      (startDate ? new Date(order.createdAt) >= new Date(startDate) : true) &&
      (endDate ? new Date(order.createdAt) <= new Date(endDate) : true) &&
      (userSearch ? order.userId.includes(userSearch) : true)
  );

  return (
    <div className="p-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4">Order Management</h2>
        <p>Showing {filteredOrders.length} out of {orders.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <input type="text" placeholder="Search Order ID" value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded w-full" />
        <input type="text" placeholder="Search User ID" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="border p-2 rounded w-full" />
        <div className="flex flex-col">
          <label className="text-sm font-medium">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-2 rounded w-full">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select value={filterShipping} onChange={(e) => setFilterShipping(e.target.value)} className="border p-2 rounded w-full">
          <option value="">All Shipping Methods</option>
          <option value="Standard">Standard</option>
          <option value="Express">Express</option>
        </select>
      </div>

      <div className="block xl:hidden">
        {filteredOrders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded-lg bg-white shadow">
            <p className="font-bold">Order ID: {order.orderId}</p>
            <p>User ID: {order.userId}</p>
            <p>Items Ordered:</p>
            {order.itemsOrdered.map((item) => (
              <p key={item.productId._id}>{String(item.productId?.name).split(' ').slice(0, 8).join(' ')} - {item.quantity} x ₹{item.price}</p>
            ))}
            <div className="flex justify-between mt-2">
              <select value={order.orderStatus} onChange={(e) => updateOrderStatus(order, e.target.value)} className="border p-2 rounded">
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select value={order.shippingMethod} onChange={(e) => updateShippingMethod(order, e.target.value)} className="border p-2 rounded">
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
              </select>
              <button onClick={() => deleteOrder(order)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden xl:block overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Items Ordered</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Shipping Method</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border p-2">{order.orderId}</td>
                <td className="border p-2">{order.userId}</td>
                <td className="border p-2"> {order.itemsOrdered.map((item) => (
                  <div key={item.productId._id}>
                    {String(item.productId?.name).split(' ').slice(0, 5).join(' ')} - {item.quantity} x ₹{item.price}
                  </div>
                ))}</td>
                <td className="border p-2"><select
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(order, e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select></td>
                <td className="border p-2"> <select
                  value={order.shippingMethod}
                  onChange={(e) => updateShippingMethod(order, e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                </select></td>
                <td className="border p-2">
                  <button onClick={() => deleteOrder(order)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;

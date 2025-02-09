import React, { useContext, useEffect, useState } from "react";
import CheckoutModal from "./CheckoutModal";
import CartContext from "../../context/CartContext/CartContext";
import AuthContext from "../../context/AuthContext/AuthContext";
import { toast } from "react-toastify";
import OrderContext from "../../context/OrderContext/OrderContext";
import { useNavigate } from "react-router";

const CartOrderSummary = ({ cart }) => {
  // Context
  const { deliveryCosts, setCart, setCartNumber } = useContext(CartContext);
  const { fetchUserDetails } = useContext(AuthContext);
  const { handleCreateOrder } = useContext(OrderContext);

  // State
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("Standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + parseInt(item.price) * item.quantity, 0);
  const deliveryCharge = deliveryMethod === "Standard" ? deliveryCosts.Standard : deliveryCosts.Express;
  const totalAmount = subtotal + deliveryCharge;

  useEffect(() => {
    const loadPincode = async () => {
      const userDetails = await fetchUserDetails();
      if (userDetails) setPinCode(userDetails.address.pinCode);
    };
    loadPincode();
  }, []);
  const handleCheckout = async () => {
    if (paymentMethod === 'cod') {
      const newOrder = {
        itemsOrdered: cart.map(item => { return { productId: item._id, quantity: item.quantity, price: parseInt(item.price) } }),
        orderStatus: "Pending",
        shippingMethod: deliveryMethod,
      }
      try {
        const response = await handleCreateOrder(newOrder);
        if (!response.success) {
          console.log(response.message);
          throw new Error(response.message);
        }
        toast.success('Order placed sucessfully!');
        navigate('/profilePage')
        setCart([]);
        setCartNumber(0)
      } catch (error) {
        toast.error('Order placement failed');
      }
    } else {
      toast.info('Online payment is not yet implemented');
    }

  };
  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-4">
      <button
        onClick={handleCheckout}
        className="mb-3 w-full sm:hidden bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
      >
        Proceed to Checkout
      </button>
      {/* Payment Method */}
      <div className="mb-3">
        <h4 className="font-medium text-base mb-2">Payment Method:</h4>
        <label className="block text-sm">
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          Cash on Delivery
        </label>
        <label className="block text-sm">
          <input
            type="radio"
            value="online"
            checked={paymentMethod === "online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          Online Payment
        </label>
      </div>

      {/* Delivery Method */}
      <div className="mb-3">
        <h4 className="font-medium text-base mb-2">Delivery Method:</h4>
        <label className="block text-sm">
          <input
            type="radio"
            value="Standard"
            checked={deliveryMethod === "Standard"}
            onChange={(e) => setDeliveryMethod(e.target.value)}
            className="mr-2"
          />
          Standard (Free)
        </label>
        <label className="block text-sm">
          <input
            type="radio"
            value="Express"
            checked={deliveryMethod === "Express"}
            onChange={(e) => setDeliveryMethod(e.target.value)}
            className="mr-2"
          />
          Express (₹50)
        </label>
      </div>

      {/* Coupon Code */}
      <div className="mb-3">
        <label htmlFor="coupon" className="block text-sm mb-1">
          Coupon Code:
        </label>
        <input
          type="text"
          id="coupon"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1.5 w-full focus:outline-none focus:ring focus:ring-blue-200 text-sm"
          placeholder="Enter coupon code"
        />
      </div>

      {/* Pincode */}
      <div className="mb-3">
        <label htmlFor="pincode" className="block text-sm mb-1">
          Pincode:
        </label>
        <input
          type="text"
          id="pincode"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1.5 w-full focus:outline-none focus:ring focus:ring-blue-200 text-sm"
          placeholder="Enter pincode"
        />
      </div>

      {/* Order Summary */}
      <div className="mb-3 text-gray-600 dark:text-gray-300 text-sm">
        <p className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{subtotal}</span>
        </p>
        <p className="flex justify-between">
          <span>Delivery Charges:</span>
          <span>₹{deliveryCharge}</span>
        </p>
        <p className="text-base font-semibold flex justify-between mt-2 text-gray-900 dark:text-white">
          <span>Total Amount:</span>
          <span>₹{totalAmount}</span>
        </p>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartOrderSummary;

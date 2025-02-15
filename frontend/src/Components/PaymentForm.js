// PaymentForm.js
import React, { useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext/AuthContext';
import OrderContext from '../context/OrderContext/OrderContext';

const PaymentForm = ({ isOpen, setIsPaymentModalOpen, product, quantity, deliveryCosts, deliveryMethod, newOrder }) => {
  const { userDetails } = useContext(AuthContext)
  const { handleCreateOrder } = useContext(OrderContext)
  const stripe = useStripe();
  const elements = useElements();
  const totalPrice = (product.price * quantity + deliveryCosts[deliveryMethod]); // Calculate total price with delivery cost

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    try {
      // Request the PaymentIntent client secret from your backend
      const response = await fetch('http://localhost:8888/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authToken': window.localStorage.getItem('authToken')
        },
        body: JSON.stringify({ amount: totalPrice }) // Example amount (in cents)
      });
      const paymentIntent = await response.json();

      // Confirm the card payment
      console.log({
        card: elements.getElement(CardElement),
        billing_details: { name: userDetails.email },
      });

      const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: userDetails.email },
        },
      });

      if (result.error) {
        console.error(result.error.message);
        toast.error(result.error.message);
        // Handle error (show message to user, etc.)
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          console.log('Result from the stripe', result);
          const response = await handleCreateOrder(newOrder);
          if (!response.success) {
            toast.error('Order placement failed');
            console.log(response.message);
            return;
          }
          setIsPaymentModalOpen(false)
          toast.success('Order placed successfully');
          toast.success('Enjoy shopping!');

          // Handle successful payment (update order status, etc.)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  };


  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className=" w-5/6 sm:w-3/4 lg:w-1/2 mx-auto p-8 bg-white rounded-lg shadow-lg space-y-6">
        {/* Product Details */}
        <div className="flex mb-6 border-b border-gray-200 pb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-32 h-32 object-cover mr-4 rounded"
          />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">Price: ₹{product.price}</p>
            <div className="flex items-center mt-2">
              <label htmlFor="quantity" className="mr-2 text-sm">Quantity:</label>
              <div className="flex items-center  rounded">
                {quantity}
              </div>
            </div>
            <p className="mt-2 font-semibold">Total Price: ₹{totalPrice}</p>
          </div>
        </div>

        {/* Payment Card Input */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <CardElement options={{ hidePostalCode: true }} className="focus:outline-none" />
        </div>

        {/* Submit Button */}
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={()=>setIsPaymentModalOpen(false)}
            className="w-full py-3 px-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div >


  );
};

export default PaymentForm;

// PaymentCard.js
import React, { useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext/AuthContext';
import OrderContext from '../../context/OrderContext/OrderContext';
import CartContext from '../../context/CartContext/CartContext';
import { useNavigate } from 'react-router';
import LoadingContext from '../../context/LoadingContext/LoadingContext';


// { isOpen, setIsPaymentModalOpen, product, quantity, deliveryCosts, deliveryMethod, newOrder }
const PaymentCard = ({ isOpen, deliveryMethod, setPaymentModal }) => {
    const { setLoading} = useContext(LoadingContext)
    const navigate = useNavigate()
    const { userDetails } = useContext(AuthContext)
    const { handleCreateOrder } = useContext(OrderContext)
    const { cart, deliveryCosts, setCart, setCartNumber } = useContext(CartContext)
    const stripe = useStripe();
    const elements = useElements();

    // Calculations
    const subtotal = cart.reduce((acc, item) => acc + parseInt(item.price) * item.quantity, 0);
    const deliveryCharge = deliveryMethod === "Standard" ? deliveryCosts.Standard : deliveryCosts.Express;
    const totalAmount = subtotal + deliveryCharge;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        try {
            // Request the PaymentIntent client secret from your backend
            
            const response = await fetch('https://apni-dukaan-3555.onrender.com/payment/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authToken': window.localStorage.getItem('authToken')
                },
                body: JSON.stringify({ amount: totalAmount }) // Example amount (in cents)
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
                        toast.success('Enjoy shopping!');
                        setPaymentModal(false)
                        setCart([]);
                        setCartNumber(0)
                        navigate('/')
                    } catch (error) {
                        toast.error('Order placement failed');
                    }
                    // Handle successful payment (update order status, etc.)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    console.log(cart);
    if (!isOpen) return null;
    return (
        <div className="flex items-center justify-center">
            <form onSubmit={handleSubmit} className=" w-5/6 sm:w-3/4 lg:w-1/2 mx-auto p-8 bg-white rounded-lg shadow-lg space-y-6">
                {/* Product Details */}
                {cart.map((product) => {
                    return (<div key={product._id} className="flex flex-col gap-2 md:flex-row mb-6 border-b border-gray-200 pb-4">
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-32 h-32 object-cover mr-4 rounded"
                        />
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-gray-600">Price: ₹{product.price}</p>
                            <div className="flex items-center md:mt-2">
                                <label htmlFor="quantity" className="mr-1 md:mr-2 text-sm">Quantity:</label>
                                <div className="flex items-center  rounded">
                                    {product.quantity}
                                </div>
                            </div>
                            <p className="md:mt-2 font-semibold">Total Price: ₹{product.price * product.quantity}</p>
                        </div>
                    </div>)
                })}
                <p className="md:mt-2 font-semibold">Order total Price: ₹{totalAmount}</p>
                {/* Payment Card Input */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    <CardElement options={{ hidePostalCode: true }} className="focus:outline-none" />
                </div>

                {/* Submit Button */}
                <div className='flex gap-2'>
                    <button
                        type='button'
                        onClick={() => { setPaymentModal(false) }}
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

export default PaymentCard;

import React, { useContext, useState } from 'react';
import CartContext from '../../context/CartContext/CartContext';
import CartItem from './CartItem';
import CartOrderSummary from './CartOrderSummary';
import PaymentCard from './PaymentCard';
import LoadingPage from '../LoadingPage';
import LoadingContext from '../../context/LoadingContext/LoadingContext';

const Cart = () => {
  const { cart } = useContext(CartContext);
  const { loading } = useContext(LoadingContext)
  const [deliveryMethod, setDeliveryMethod] = useState("Standard");
  const [paymentModal, setPaymentModal] = useState(false)

  return (
    <>
      {cart.length < 1 ? (
        <div className="w-full h-full text-center font-semibold mt-16 mb-10">
          Your cart is empty. Add some products to proceed.
        </div>
      ) : (!paymentModal ?
        <div className="flex flex-col md:flex-row justify-between mx-4 md:mx-20">
          <div className="w-full md:w-3/4">
            {cart.map((product, index) => (
              <CartItem product={product} key={index} />
            ))}
          </div>
          <div className="w-full md:w-1/4 mt-4 md:mt-0 md:ml-3">
            <CartOrderSummary
              cart={cart}
              deliveryMethod={deliveryMethod}
              setPaymentModal={setPaymentModal}
              setDeliveryMethod={setDeliveryMethod}
            />
          </div>
        </div> : (!loading ?
          <div>
            <PaymentCard
              isOpen={paymentModal}
              deliveryMethod={deliveryMethod}
              setPaymentModal={setPaymentModal}
            />
          </div>
          :
          <div className="w-full h-full text-center font-semibold mt-16 mb-10">
            Loading...
          </div>
        )
      )}
    </>
  );
};

export default Cart;

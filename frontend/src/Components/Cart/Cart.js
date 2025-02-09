import React, { useContext } from 'react';
import CartContext from '../../context/CartContext/CartContext';
import CartItem from './CartItem';
import CartOrderSummary from './CartOrderSummary';

const Cart = () => {
  const { cart } = useContext(CartContext);

  return (
    <>
      {cart.length < 1 ? (
        <div className="w-full h-full text-center font-semibold mt-16 mb-10">
          Your cart is empty. Add some products to proceed.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between mx-4 md:mx-20">
          <div className="w-full md:w-3/4">
            {cart.map((product, index) => (
              <CartItem product={product} key={index} />
            ))}
          </div>
          <div className="w-full md:w-1/4 mt-4 md:mt-0 md:ml-3">
            <CartOrderSummary cart={cart} />
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;

import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../../context/CartContext/CartContext';
import CartItem from './CartItem';
import CartOrderSummary from './CartOrderSummary';

const Cart = () => {
    const { cart } = useContext(CartContext)

    return (
        <>
            {cart.length < 1 ?
                <div className='w-full h-full text-center font-semibold mt-16 mb-10'>
                    Your cart is empty. Add some products to proceed.
                </div>
                :
                <div className='flex justify-between mx-20'>
                    <div className='w-3/4'>
                        {cart.map((product, index) => {
                            return <CartItem product={product} key={index} />
                        })}
                    </div>
                    <div className='w-1/4 mx-3'>
                        <CartOrderSummary cart={cart} />
                    </div>

                </div>
            }

        </>
    );
};
export default Cart
import React, { useState } from 'react'
import CartContext from './CartContext'

function CartState(props) {
    const initialCart = JSON.parse(window.localStorage.getItem('cart')) || [];
    const [cart, setCart] = useState(initialCart);
    const [cartNumber, setCartNumber] = useState(0);
    const deliveryCosts = {
        Standard: 0,
        Express: 50 // Example cost for express delivery
    };

    const addToCart = (product) => {
        const existingProduct = cart.find(item => item._id === product._id);
        if (existingProduct) {
            return "Already exists!";
        } else {
            const newProduct = { ...product, quantity: 1 };
            const newCart = [...cart, newProduct];
            window.localStorage.setItem('cart', JSON.stringify(newCart));
            setCart(newCart);
            setCartNumber(newCart.length);
            return "Successfully added to cart";
        }
    };

    const removeFromCart = (product) => {
        const newCart = cart.filter(item => item._id !== product._id);
        window.localStorage.setItem('cart', JSON.stringify(newCart));
        setCart(newCart);
        setCartNumber(newCart.length);
        return "Successfully removed to cart"
    };
    const incrementQuantity = (product) => {
        const newCart = cart.map(item =>
            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
        window.localStorage.setItem('cart', JSON.stringify(newCart));
        setCart(newCart);
        setCartNumber(newCart.length);
        return "Successfully updated the quantity";
    };
    
    const decrementQuantity = (product) => {
        if (product.quantity > 1) {
            const newCart = cart.map(item =>
                item._id === product._id ? { ...item, quantity: item.quantity - 1 } : item
            );
            window.localStorage.setItem('cart', JSON.stringify(newCart));
            setCart(newCart);
            setCartNumber(newCart.length);
            return "Successfully updated the quantity";
        } else {
            removeFromCart(product);
            return "Successfully updated the quantity";
        }
    };
    return (
        <CartContext.Provider value={{
            cart,
            setCart,
            cartNumber,
            setCartNumber,
            addToCart,
            removeFromCart,
            incrementQuantity,
            decrementQuantity,
            deliveryCosts

        }} >
            {props.children}
        </CartContext.Provider>
    )
}

export default CartState

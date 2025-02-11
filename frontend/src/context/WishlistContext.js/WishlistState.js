import React,{ useContext,useEffect,useState } from 'react';
import WishlistContext from './WishlistContext'
import LoadingContext from '../LoadingContext/LoadingContext';


function WishlistState({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const {loading, setLoading} = useContext(LoadingContext);

    // Function to fetch the current user's wishlist.
    const getWishlist = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:8888/wishlist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authToken': token,
                },
            });
            const data = await response.json();
            setLoading(false);
            if (response.ok) {
                // The backend sends an object like { wishlist: [...] }
                setWishlist(data.wishlist);
            } else {
                throw new Error (data.message || "Failed to fetch wishlist")
            }
        } catch (error) {
            setLoading(false);
            console.error("Server error.",error);
            throw new Error (error)
        }
    };
    
    // Function to add a product to the wishlist.
    const addToWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:8888/wishlist/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authToken': token,
                },
                body: JSON.stringify({ productId }),
            });
            const data = await response.json();
            if (response.ok) {
                // Update the local state with the new wishlist array
                setWishlist(data.wishlist);
            } else {
                throw new Error (data.message || "Failed to add product to wishlist")
            }
        } catch (error) {
            console.error("Server error.",error);
            throw new Error (error)
        }
    };
    
    // Function to remove a product from the wishlist.
    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:8888/wishlist/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authToken': token,
                },
                body: JSON.stringify({ productId }),
            });
            const data = await response.json();
            if (response.ok) {
                // Update the local state with the new wishlist array
                setWishlist(data.wishlist);
            } else {
                throw new Error (data.message || "Failed to remove product from wishlist")
            }
        } catch (error) {
            console.error("Server error.",error);
            throw new Error (error)
        }
    };

    // Optionally, load the wishlist when the provider mounts (if the user is logged in)
    useEffect(() => {
        getWishlist();
    }, []);
    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                getWishlist,
                addToWishlist,
                removeFromWishlist,
            }} >
            {children}
        </WishlistContext.Provider>)
}

export default WishlistState
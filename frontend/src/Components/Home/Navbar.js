import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import CartContext from '../../context/CartContext/CartContext';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext/AuthContext';

function Navbar() {
  const { cartNumber } = useContext(CartContext);
  const [products, setProducts] = useState([])
  const { userDetails, fetchUserDetails } = useContext(AuthContext);
  const navigate = useNavigate();
  const menuButtonRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8888/product/getAllProduct`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Response from backend:', data);
      const productsData = data.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }


  // Compute suggestions based on the search query.
  // It filters products whose name includes the search query (case-insensitive),
  // sorts them based on the position of the match, and takes the first 5.
  const suggestions =
    searchQuery.trim() === ""
      ? []
      : products
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort(
          (a, b) =>
            a.name
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase()) -
            b.name.toLowerCase().indexOf(searchQuery.toLowerCase())
        )
        .slice(0, 5);

  const onLogOutIn = () => {
    if (window.localStorage.getItem('authToken')) {
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('cart');

      toast.success('Logged Out Successfully');
    }
    navigate('/auth/login');
  };

  useEffect(() => {
    fetchProducts()
    fetchUserDetails();
  }, []);

  // Called when the user wants to search.
  // Navigates to a search route with the search query as a URL parameter.
  // Handler when a suggestion is clicked:
  // It navigates to the product detail page and clears the search query.
  const handleSuggestionClick = (product) => {
    setSearchQuery("");
    navigate(`/${product.mainCategory}/${product.subCategory}/${product._id}`);
  };

  return (
    <div className=''>
      <nav className="shadow-md bg-white dark:bg-gray-900 sticky w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <i className="fa-solid fa-shop fa-lg pt-1"></i>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Apni Dukaan
            </span>
          </Link>
          <div className="flex md:order-2">
            {/* Desktop Search Input */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search icon</span>
              </div>
              <input
                type="text"
                id="search-navbar"
                className="block md:w-96 w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}

              />
              {/* Search Suggestions for Desktop */}
              {searchQuery && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-lg mt-1">
                  {suggestions.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSuggestionClick(product)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                // Toggle mobile menu visibility
                menuButtonRef.current.classList.toggle('hidden');
              }}
              data-collapse-toggle="navbar-search"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-search"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-2"
            ref={menuButtonRef}
            id="navbar-search"
          >
            {/* Mobile Search Input */}
            <div className="relative mt-3 md:hidden">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search-navbar1"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}

              />
              {/* Search Suggestions for Mobile */}
              {searchQuery && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-lg mt-1">
                  {suggestions.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSuggestionClick(product)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <div
                onClick={onLogOutIn}
                className="select-none cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {!window.localStorage.getItem('authToken')
                  ? 'LogIn/SignUp'
                  : 'LogOut'}
              </div>
              <div className="relative">
                {cartNumber > 0 && (
                  <span className="bg-red-600 absolute -top-2 text-sm -right-0 rounded-full px-1.5 font-bold">
                    {cartNumber}
                  </span>
                )}
                <div
                  className="mx-2 cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => {
                    console.log('Cart clicked');
                    navigate('/cart');
                  }}
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                </div>
              </div>
              {window.localStorage.getItem('authToken') ? (
                <div>
                  <Link to="/profilePage">
                    <img
                      src={userDetails.profileUrl}
                      alt="Profile"
                      className="h-12 w-12 cursor-pointer rounded-full"
                    />
                  </Link>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

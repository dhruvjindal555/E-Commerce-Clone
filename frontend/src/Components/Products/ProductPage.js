import React, { useContext, useEffect, useState } from 'react'
import Review from '..//Review/Review';
import ReviewsList from '../Review/ReviewsList';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useLoaderData, useNavigate } from 'react-router';
import CartContext from '../../context/CartContext/CartContext';
import CheckoutModal from '../Cart/CheckoutModal';
import OrderContext from '../../context/OrderContext/OrderContext';
import LoadingPage from '../LoadingPage';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext/AuthContext';
import LoadingContext from '../../context/LoadingContext/LoadingContext';
import WishlistContext from '../../context/WishlistContext/WishlistContext';

function ProductPage() {
    const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate()
    const { loading } = useContext(LoadingContext)
    const { addToCart, cart, deliveryCosts } = useContext(CartContext)
    const { userDetails } = useContext(AuthContext)
    const data = useLoaderData()
    const [modelYear, setModelYear] = useState(2023);
    const [pincode, setPincode] = useState('');
    const [showAddReview, setShowAddReview] = useState(false);
    const [reviewsRefresh, setReviewsRefresh] = useState(0);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { handleCreateOrder } = useContext(OrderContext);

    const [deliveryMethod, setDeliveryMethod] = useState('Standard'); // Default delivery method
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Default payment method

    // Callback when a review is added.
    const handleReviewAdded = () => {
        // Update the trigger to re-fetch the reviews.
        setReviewsRefresh((prev) => prev + 1);
    };
    const handlePincodeChange = (e) => {
        setPincode(e.target.value);
    };

    const isPincodeInvalid = () => {
        return pincode && pincode.length !== 6; // Assuming a valid pincode is 6 digits long
    };

    const handleBuyNow = () => {
        if (!window.localStorage.getItem('authToken')) return toast.error('You are required to login first!')
        // console.log(userDetails)
        // console.log(userDetails.phoneNumber)
        // console.log(userDetails.address.street)
        // console.log(userDetails.address.city)
        // console.log(userDetails.address.pinCode)
        // console.log(userDetails.address.country)
        if (userDetails && userDetails.phoneNumber && userDetails.address.street && userDetails.address.city && userDetails.address.pinCode
            && userDetails.address.country) {
            setIsCheckoutModalOpen(true);
            console.log(data);
        } else {
            toast.error('You are required to fill the adress details first!')
            navigate('/profilePage')
        }
    };

    const handleCheckout = async () => {
        if (paymentMethod === 'cod') {
            const newOrder = {
                itemsOrdered: [
                    {
                        productId: data._id,
                        quantity: quantity,
                        price: Math.round(data.price * quantity + deliveryCosts[deliveryMethod])
                    }
                ],
                orderStatus: "Pending",
                shippingMethod: deliveryMethod,
            }
            const response = await handleCreateOrder(newOrder);
            if (!response.success) {
                toast.error('Order placement failed');
                console.log(response.message);
                return;
            }
            setIsCheckoutModalOpen(false);
            toast.success('Order placed sucessfully!');
        } else {
            toast.info('Online payment is not yet implemented');
        }

    };
    const handleLike = async () => {
        if (liked == true) {
            try {
                await removeFromWishlist(data._id)
                toast.success('Removed from wishlist')
            } catch (error) {
                toast.error('Failed to remove from wishlist')
                console.error("Error removing from wishlist:", error);
            }
        } else {
            try {
                await addToWishlist(data._id)
                toast.success('Added to wishlist')
            } catch (error) {
                toast.error('Failed to add to wishlist')
                console.error("Error adding to wishlist:", error);
            }
        }
    }
    useEffect(() => {
        // console.log('Wishlist changing');
        // console.log(wishlist)
        // Check if the current product exists in the wishlist using .some()
        const isLiked = wishlist.some((val) => {
            // console.log(String(val._id), String(product._id));
            return String(val._id) === String(data._id)
        });
        setLiked(isLiked);
    }, [wishlist, data._id]); // Run this effect when wishlist or product._id changes

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    // Effect to lock/unlock scroll when modal is open
    useEffect(() => {
        if (isCheckoutModalOpen) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = 'unset'; // Restore scrolling
        }

        return () => {
            document.body.style.overflow = 'unset'; // Clean up on unmount
        };
    }, [isCheckoutModalOpen]);

    if (loading) return <LoadingPage />
    return (
        <div >
            <div className="lg:mx-20 md:mx-10 mx-4 md:px-10 sm:px-4 px-2 bg-white shadow-lg rounded-lg overflow-hidden xl:flex-row flex-col flex justify-evenly ">
                <div className="md:flex-shrink-0 flex flex-col justify-center xl:block">
                    <Carousel stopOnHover infiniteLoop autoPlay interval={2000} className='md:w-screen-75 w-3/4 sm:w-fit  mx-auto'>
                        {data.images.map((url, index) => {
                            return (<div className='flex justify-center items-center h-fit w-full  ' key={index}>
                                <img
                                    key={index}
                                    className="object-contain object-center max-h-96"
                                    src={url}
                                    alt={data.name}
                                />
                            </div>
                            )
                        })}
                    </Carousel>
                    <div className="flex flex-row gap-3 xl:space-x-4 justify-center">
                        <button
                            onClick={() => {
                                toast.success(addToCart(data));
                                console.log(cart);
                            }}
                            className=" w-full bg-yellow-300 hover:bg-yellow-400 text-white text-lg   font-bold py-1 px-2 sm:py-2 sm:px-4 rounded inline-flex items-center justify-center ">
                            <i className="fa-solid fa-cart-shopping pr-2"></i>
                            Add to cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="w-full cursor-pointer bg-orange-300 hover:bg-orange-400 text-white text-lg font-bold py-1 px-2 sm:py-2 sm:px-4 rounded inline-flex items-center justify-center">
                            <i className="pr-2 fa-solid fa-bolt"></i>
                            Buy Now
                        </button>
                    </div>
                </div>
                <div className="flex flex-col justify-start py-5">
                    <div className="px-4 py-2 flex flex-col">
                        <div className='flex  justify-between'>
                            <div className="uppercase text-gray-600 mb-3 tracking-wide text-xl font-bold">
                                {data.brand}
                            </div>
                            <div>
                                <svg
                                    onClick={handleLike}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="cursor-pointer"
                                    height="20"
                                    width="20"
                                    viewBox="0 0 512 512"
                                >
                                    <path
                                        fill={liked ? "#ff0000" : ""}
                                        d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="uppercase tracking-wide text-xl ">
                            {data.name}
                        </div>
                        <div className="  flex gap-2 my-2 ">
                            <div className='bg-green-600 w-fit px-2 rounded-xl flex items-center text-white'>
                                <span className='pr-1 ' >{data.rating} </span>
                                <i className="fa-solid fa-star fa-sm"></i>
                            </div>
                            <div className='w-fit text-gray-500'>
                                <span>200 ratings & 50 reviews</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-4  rounded xl:mx-auto">
                        <div className="text-green-600 font-semibold ">Special Price</div>
                        <div className="text-3xl font-bold text-gray-800">{"₹" + data.price} <span className="line-through text-gray-500 text-xl">{"₹" + data.mrp}</span> <span className="text-green-600 text-xl">25% off</span></div>
                        <div className="mt-2">
                            <div className="text-green-600 font-semibold">Coupons for you</div>
                            <div className="text-gray-800 font-medium mt-1">
                                <span className="inline-flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.553 2.378a1 1 0 011.894 0l1.286 4.085h4.287a1 1 0 01.688 1.748l-3.47 2.519 1.286 4.085a1 1 0 01-1.538 1.152l-3.47-2.52-3.471 2.52a1 1 0 01-1.537-1.152l1.286-4.085-3.47-2.52a1 1 0 01.688-1.748h4.287L9.553 2.378z" />
                                    </svg>
                                    <span>Partner offer Buy this product and get upto ₹500 off</span>
                                </span>
                            </div>
                            <div className="text-indigo-500 font-medium mt-1 cursor-pointer">View more coupons</div>
                        </div>
                        <div className="mt-4">
                            <div className="font-semibold text-gray-800">Available offers</div>
                            <ul className="mt-2 list-disc list-inside">
                                <li className="text-gray-700">Bank offers 10% off on Axis Bank Credit Card Transactions, up to ₹1,250 on orders of ₹5,000 and above</li>
                                <li className="text-gray-700 mt-1">Bank offers 10% off on HDFC Bank Credit Card Transactions, up to ₹1,250 on orders of ₹5,000 and above</li>
                                <li className="text-gray-700 mt-1">Bank offers 10% off on ICICI Bank Credit Card Transactions, up to ₹1,250 on orders of ₹5,000 and above</li>
                                <li className="text-gray-700 mt-1">Special Price Get extra 6% off (price inclusive of cashback/coupon)</li>
                                <li className="text-gray-700 mt-1">Bank offers 10% off on SBI Bank Credit Card Transactions, up to ₹1,250 on orders of ₹5,000 and above</li>
                            </ul>
                        </div>
                    </div>
                    <div className="p-4 rounded ">
                        <div className="text-gray-500">For warranty details visit Brand's official website</div>
                        <div className="mt-4 flex justify-start items-center gap-4 ">
                            <div className="text-gray-700 font-semibold">Model year</div>
                            <div className="flex space-x-2 mt-1">
                                <button
                                    className={`px-4 py-2 border rounded ${modelYear === 2023 ? 'bg-blue-500 text-white' : 'bg-white'} font-semibold`}
                                    onClick={() => setModelYear(2023)}
                                >
                                    2023
                                </button>
                                <button
                                    className={`px-4 py-2 border rounded ${modelYear === 2024 ? 'bg-blue-500 text-white' : 'bg-white'} font-semibold`}
                                    onClick={() => setModelYear(2024)}
                                >
                                    2024
                                </button>
                            </div>
                        </div>
                        <div className="my-3 flex justify-between items-start sm:items-center sm:flex-row flex-col ">
                            <div className='flex gap-4 ' >
                                <div className="text-gray-700 font-semibold flex items-center">
                                    <svg className="w-5 h-5 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9.586V7a1 1 0 112 0v3a1 1 0 01-.293.707l-2 2a1 1 0 01-1.414-1.414l1.707-1.707z" />
                                    </svg>
                                    Delivery
                                </div>
                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={handlePincodeChange}
                                    className="mt-1 block  border-b-2 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter pincode"
                                />
                            </div>
                            {isPincodeInvalid() && (
                                <div className="text-red-500 mt-1">Invalid Pincode</div>
                            )}
                            <div className="text-gray-700 font-medium mt-1">Delivery by Wed Jul 24 2024 | Free</div>
                        </div>
                        <div className='flex justify-between flex-col sm:flex-row'>
                            <div className="mt-4">
                                <div className="text-gray-700 font-semibold">Highlights</div>
                                <ul className="list-disc list-inside mt-1">
                                    {data.features.map((item, index) => {
                                        return (<li key={index} className="text-gray-700">{item}</li>)
                                    })}
                                </ul>
                            </div>
                            <div className="mt-4">
                                <div className="text-gray-700 font-semibold">Easy Payment Options</div>
                                <ul className="list-disc list-inside mt-1">
                                    <li className="text-gray-700">No cost EMI starting from ₹925/month</li>
                                    <li className="text-gray-700">Cash on Delivery</li>
                                    <li className="text-gray-700">Net banking & Credit/ Debit/ ATM card</li>
                                </ul>
                            </div>
                        </div>
                        <div className='flex my-3 sm:gap-4 sm:flex-row flex-col'>
                            <span className='text-gray-700 font-semibold'>Description</span>
                            <p className="">{data.description}</p>
                        </div>
                        <div className="md:p-3">
                            <div className="mt-6 border-t border-gray-200 pt-4">
                                <h2 className="text-xl font-bold">Ratings & Reviews</h2>
                                <div className="mt-2">
                                    <button
                                        onClick={() => {
                                            document.body.style.overflow = 'hidden';
                                            setShowAddReview(true);
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded shadow"
                                    >
                                        Add Review
                                    </button>
                                </div>
                            </div>
                            {/* Render the review modal */}
                            <Review
                                show={showAddReview}
                                setShow={setShowAddReview}
                                productId={data._id}
                                onReviewAdded={handleReviewAdded}
                            />
                            {/* Render the list of reviews */}
                            <ReviewsList
                                productId={data._id}
                                currentUserId={userDetails?._id}
                                refreshTrigger={reviewsRefresh}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <CheckoutModal
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                deliveryCosts={deliveryCosts}
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                setQuantity={setQuantity}
                product={data}
                quantity={quantity}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                onCheckout={handleCheckout}
            />
        </div>
    )
}

export default ProductPage
export const productPageLoader = async ({ params }) => {
    const { id } = params;
    try {
        const response = await fetch(`http://localhost:8888/product/getProduct/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json()
        console.log('Response from backend:', data);
        return data.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return {}; // Return an empty object or handle the error as needed
    }
};

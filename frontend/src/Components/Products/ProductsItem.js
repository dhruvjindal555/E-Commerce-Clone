import React, { useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Link, useNavigate } from 'react-router-dom';


const ProductsItem = ({ product }) => {
    const [liked, setLiked] = useState(false)
    const navigate = useNavigate()
    const navigateToItem = () => {
        navigate(`/${product.mainCategory}/${product.subCategory}/${product._id}`)
    }
    return (
        <div className="flex border rounded-lg p-4 justify-evenly shadow-md h-fit flex-wrap md:flex-nowrap" >
            <div onClick={navigateToItem} className="cursor-pointer flex-shrink-0  rounded-lg min-w-48 max-w-64 max-h-64 min-h-48">
                <Carousel stopOnHover infiniteLoop autoPlay showThumbs={false} interval={2000} className='w-48 h-48'>
                    {product.images.map((url, index) => {
                        return (<div className='flex justify-center items-center bg-contain ' key={index}>
                            <img
                                className=" object-contain  max-h-48 rounded-lg"
                                src={url}
                                alt={product.name}
                            />
                            {/* <p className="legend">{"Legend "+(index+1)}</p> */}
                        </div>
                        )
                    })}
                </Carousel>
            </div>
            <div onClick={navigateToItem} className="cursor-pointer flex-grow ml-4 order-3 md:order-2">
                <div className="flex items-center mb-2">
                    <span className="text-xl font-bold">{product.brand}</span>
                </div>
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <div className="flex items-center text-green-500 mb-2">
                    <span className="ml-1">{product.rating}</span>
                    <i className="fa-solid fa-star fa-sm px-1"></i>
                </div>
                <ul className="list-disc pl-5 mb-4">
                    {product.features.map((item, index) => {
                        return (<li key={index} className="">{item}</li>)
                    })}
                </ul>
            </div>
            <div className="flex-shrink-0 w-full sm:w-fit text-right lg:mr-10 order-2 md:order-3">
                <div className="text-2xl font-bold">{"₹" + product.price}</div>
                <div className="line-through text-gray-500">{"₹" + product.mrp}</div>
                <div className="text-green-500">Delivery: Free</div>
                <div className="text-gray-500">Est. Delivery Date: Thu Jul 25 2024</div>
                <div className="text-green-600 font-semibold">Bank Offers Available</div>
                <div className='flex justify-end mt-4 text-red-600'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
                        <path fill={liked?"#ff0000":""} d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                    </svg>
                </div>
                
            </div>
        </div>
    );
};

export default ProductsItem;

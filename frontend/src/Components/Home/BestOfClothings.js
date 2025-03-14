import React, { useState, useEffect,useContext } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LoadingPage from '../LoadingPage';
import LoadingContext from '../../context/LoadingContext/LoadingContext';

const BestOfClothings = () => {
  const [FashionProducts, setFashionProducts] = useState([]);
  const {loading, setLoading} = useContext(LoadingContext)

  useEffect(() => {
    setLoading(true)
    fetch('https://apni-dukaan-3555.onrender.com/product/getAllProduct')
    .then((response) => response.json())
    .then((responseData) => {
        console.log('API Response:', responseData);
        const data = responseData.data;
        setLoading(false)
        
        if (Array.isArray(data)) {
          const fashionData = data.filter((product) => product.mainCategory === 'Fashion');
          setFashionProducts(fashionData.slice(0, 7));
        } else {
          console.error('Error fetching products: Unexpected API response format');
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error.message);
      });
  }, []);
  if (loading) return <LoadingPage/>
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5, 
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className=' m-2 mt-5 rounded-lg border-1 mx-5 shadow-lg'>
      <h2 className='ml-6 font-semibold text-2xl'>Choose from latest and trendy style</h2>
      <div className='m-3  pb-5 '>
        <Slider {...settings}>
          {FashionProducts.map((product) => (
            <Link key={product._id} to={`/${product.mainCategory}/${product.subCategory}`}>
              <div className='flex flex-col h-64 bg-white  border-gray-200 p-1 justify-center align-middle items-center'>
                <img src={product.images[0]} alt="" className='object-cover object-center rounded-md w-44 h-40 cursor-pointer hover:scale-110' />
                <p className='font-base text-xl'> {product.subCategory}</p>
                <p className='font-semibold'>Starting From Rs{product.price}</p>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BestOfClothings;
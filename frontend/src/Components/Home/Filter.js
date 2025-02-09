import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
const Filter = ({ filteredProducts, setFilteredProducts, brands, products }) => {
  const [filterOptions, setFilterOptions] = useState({
    sortOrder: "lowToHigh",
    brand: "ALL",
    priceRange: [0, 1000000],
    rating: 0,
  })
  useEffect(() => {
    const handleFilter = () => {
      let newProducts = [...products].sort((a, b) =>
        filterOptions.sortOrder === 'highToLow' ? b.price - a.price : a.price - b.price
      );
      if (filterOptions.brand !== 'ALL') {
        newProducts = newProducts.filter(product => product.brand === filterOptions.brand)
      }
      newProducts = newProducts.filter(product => product.rating >= filterOptions.rating)
      newProducts = newProducts.filter(product => product.price >= filterOptions.priceRange[0] && product.price <= filterOptions.priceRange[1])
      console.log("newProducts", newProducts);
      console.log("filterOptions", filterOptions);
      setFilteredProducts(newProducts)
    }
    handleFilter()
  }, [filterOptions])

  return (
    <div className="lg:p-4 p-1 pb-2 md:p-1 mb-3 md:mb-0 border rounded flex-wrap shadow-sm xl:w-64 flex justify-around lg:flex-col sticky top-10 mr-1">
      <h2 className="text-xl font-bold md:mb-4 w-full md:w-fit pl-2 md:p-0">Filter</h2>
      <div className="md:mb-4">
        <label className="block font-medium mb-2">Sort by:</label>
        <select className="w-full md:p-2 p-1 border rounded"
          value={filterOptions.sortOrder}
          onChange={(e) => {
            setFilterOptions((prev) => {
              return { ...prev, sortOrder: e.target.value }
            })
          }} >
          <option value='lowToHigh'>Low to High Price</option>
          <option value='highToLow'>High to Low Price</option>
        </select>
      </div>
      <div className="md:mb-4">
        <label className="block font-medium mb-2">Filter by Price :</label>
        <Slider min={0} max={1000000} range value={filterOptions.priceRange} onChange={(e) => {
          setFilterOptions((prev) => {
            return { ...prev, priceRange: [e[0], e[1]] }
          })
        }} />
        <div className="flex justify-between">
          <span>₹{filterOptions.priceRange[0]}</span>
          <span>₹{filterOptions.priceRange[1]}</span>
        </div>
      </div>
      <div className="md:mb-4">
        <label className="block font-medium md:mb-2 md-1">Brand</label>
        <select
          className="w-full md:p-2 p-1 border rounded"
          value={filterOptions.brand}
          onChange={(e) => {
            setFilterOptions((prev) => {
              return { ...prev, brand: e.target.value }
            })
          }}>
          <option value='ALL'>All</option>
          {brands.map((e, i) => {
            return <option key={i} value={e}>{e}</option>
          })}
        </select>
      </div>
      <div className="md:mb-4">
        <label className="block font-medium md:mb-2 mb-1" >Rating</label>
        <select
          className="w-full md:p-2 p-1 border rounded"
          value={filterOptions.rating}
          onChange={(e) => {
            setFilterOptions((prev) => {
              return { ...prev, rating: e.target.value }
            })
          }}>
          <option defaultChecked value="1">{">1 Star"}</option>
          <option value="2">{">2 Stars"}</option>
          <option value="3">{">3 Stars"}</option>
          <option value="4">{">4 Stars"}</option>
        </select>
      </div>

    </div>
  );
};

export default Filter;

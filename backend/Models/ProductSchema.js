const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    mainCategory: {
        type: String,
    },
    subCategory: {
        type: String,
    },
    name: {
        type: String,
    },
    price: {
        type: String,
    },
    brand: {
        type: String
    },
    mrp: {
        type: String,
    },
    images: {
        type: Array,
    },
    description: {
        type: String,
    },
    features: {
        type: Array,
    },
    rating: {
        type: String,
    },
    color: {
        type: String,
    },

});


const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
const express = require("express");
const router = express.Router();
const fetchUser = require('../Middleware/fetchUser')
const { getAllProduct, getProductById,createProduct,updateProduct,deleteProduct } = require('../Controllers/Product');
const upload = require("../Middleware/multer");

// GET all products
router.get("/getAllProduct", getAllProduct);

// GET a product by id
router.get("/getProduct/:id", getProductById);

// POST create a new product (admin only)
router.post('/', fetchUser, upload.array('productImages', 5), createProduct);

// PUT update product by id (admin only)
router.put('/:id', fetchUser, upload.array('productImages', 5), updateProduct);

// DELETE product by id (admin only)
router.delete('/:id', fetchUser, deleteProduct);

module.exports = router;
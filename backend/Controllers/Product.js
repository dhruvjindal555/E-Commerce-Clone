const Product = require('../Models/ProductSchema');
const User = require('../Models/UserSchema');
const Joi = require('joi');
const cloudinary = require("../config/cloudinary")

// Define Joi validation schema based on product schema
const productValidationSchema = Joi.object({
    mainCategory: Joi.string().required().messages({
        'any.required': 'Main category is required',
        'string.base': 'Main category must be a string',
    }),
    subCategory: Joi.string().required().messages({
        'any.required': 'Sub category is required',
        'string.base': 'Sub category must be a string',
    }),
    name: Joi.string().required().messages({
        'any.required': 'Name is required',
        'string.base': 'Name must be a string',
    }),
    price: Joi.string().required().messages({
        'any.required': 'Price is required',
        'string.base': 'Price must be a string',
    }),
    mrp: Joi.string().optional().messages({
        'string.base': 'MRP must be a string',
    }),
    images: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Images must be an array of URLs',
    }),
    description: Joi.string().optional().messages({
        'string.base': 'Description must be a string',
    }),
    features: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Features must be an array of strings',
    }),
    rating: Joi.string().optional().messages({
        'string.base': 'Rating must be a string',
    }),
    brand: Joi.string().optional().allow("").messages({
        'string.base': 'Brand must be a string',
    }),
    color: Joi.string().optional().messages({
        'string.base': 'Color must be a string',
    }),
});

async function getAllProduct(req, res) {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            data: products,
            message: "Successfully fetched all products",
        });
        console.log(products.length);
    } catch (err) {
        console.log("An error occurred while fetching products: " + err.message);
        return res.status(500).json({
            success: false,
            message: 'Error fetching all products',
            error: err.message,
        });
    }
}

async function getProductById(req, res) {
    const { id } = req.params;
    try {
        const product = await Product.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: product,
        });
    } catch (error) {
        console.error('Error fetching product by id:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching product by id',
            error: error.message,
        });
    }
}

async function createProduct(req, res) {
    // Check admin authorization
    const adminId = req.user.id;
    try {
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        if (admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Admin access required",
            });
        }
        if (req.files) {
            const imageUrls = req.files.slice(0, 5).map((file) => (file.path))
            console.log(req.body);
            req.body.images = imageUrls
        }
        // Validate req.body against the Joi schema
        if (req.body.features)
            req.body.features = JSON.parse(req.body.features)

        const { error } = productValidationSchema.validate(req.body);
        if (error) {
            const destroyPromises = req.files.slice(0, 5).map((file) => {
                console.log(file);
                return cloudinary.uploader.destroy(file.filename)
            })
            // Use Promise.all to await all destroy promises
            await Promise.all(destroyPromises);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message,
        });
    }
}

async function updateProduct(req, res) {
    // Check admin authorization
    const adminId = req.user.id;
    const { id } = req.params;
    try {
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        if (admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Admin access required",
            });
        }

        if (req.files) {
            const imageUrls = req.files.slice(0, 5).map((file) => (file.path))
            console.log(req.body);
            req.body.images = imageUrls
        }

        if(req.body.features)
            req.body.features = JSON.parse(req.body.features)

        if(req.body.profileImages)
            delete req.body.profileImages;
        // Validate req.body against the Joi schema
    
        const { error } = productValidationSchema.validate(req.body);
        if (error) {
            const destroyPromises = req.files.slice(0, 5).map((file) => {
                console.log(file);
                return cloudinary.uploader.destroy(file.filename)
            })
            // Use Promise.all to await all destroy promises
            await Promise.all(destroyPromises);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message,
        });
    }
}

async function deleteProduct(req, res) {
    // Check admin authorization
    const adminId = req.user.id;
    const { id } = req.params;
    try {
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        if (admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Admin access required",
            });
        }
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const images = product.images
        console.log(images);
        if (images.length > 0 && String(images[0]).includes('cloudinary')) {

            const destroyPromises = product.images.map((img) => {
                const filenameWithExtension = String(img).split('/').pop();
                const filename = filenameWithExtension.split('.')[0];
                console.log(filename);
                return cloudinary.uploader.destroy(filename)
            })

            // Use Promise.all to await all destroy promises
            await Promise.all(destroyPromises);
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: product,
        });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message,
        });
    }
}

module.exports = {
    getAllProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

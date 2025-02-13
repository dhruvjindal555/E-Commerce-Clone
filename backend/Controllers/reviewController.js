const Review = require("../Models/ReviewSchema")
const Product = require("../Models/ProductSchema")
const User = require("../Models/UserSchema")
const cloudinary = require("../config/cloudinary")

const createReview = async (req, res) => {
    try {
        console.log('working...');        
        const { productId, rating, title, description } = req.body;
        const userId = req.user.id;
        let imageUrls = [];
        console.log('imageUrls',imageUrls);        

        // Extract image URLs directly from req.files
        if (req.files) {
            imageUrls = req.files.slice(0,3).map((file) => ({
                public_id: file.filename, // Cloudinary public ID
                url: file.path, // Cloudinary image URL
            }));
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ user: userId, product: productId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this product." });
        }

        // Create review
        const review = new Review({
            user: userId,
            product: productId,
            rating,
            title,
            description,
            images: imageUrls,
        });
        await review.save();
        res.status(201).json({ message: "Review added successfully.", review });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId })
            .populate("user", "fullName email")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user", "fullName").populate('product','name')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);
        const userRole = user.role;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }

        // Only admin or the user who created the review can delete it
        if (review.user.toString() !== userId && userRole !== "admin") {
            return res.status(403).json({ message: "Unauthorized to delete this review." });
        }
        
        // Only admin or the user who created the review can delete it
        // if (review.user.toString() !== userId ) {
        //     return res.status(403).json({ message: "Unauthorized to delete this review." });
        // }

        // Delete images from Cloudinary
        if (review.images.length > 0) {
            const deletePromises = review.images.map(async (image) => {
                return cloudinary.uploader.destroy(image.public_id);
            });
            await Promise.all(deletePromises);
        }

        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { createReview,getAllReviews, getProductReviews, deleteReview };
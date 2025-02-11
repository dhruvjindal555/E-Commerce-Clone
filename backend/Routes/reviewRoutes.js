const express = require("express");
const { createReview, getProductReviews, deleteReview } = require("../Controllers/reviewController");
const fetchUser = require("../Middleware/fetchUser")
const upload = require("../Middleware/multer") // Middleware for file uploads

const router = express.Router();

router.post("/", fetchUser, upload.array("files", 3), createReview); // Users can upload up to 3 images
router.get("/:productId", getProductReviews);
router.delete("/:reviewId", fetchUser, deleteReview);

module.exports = router;

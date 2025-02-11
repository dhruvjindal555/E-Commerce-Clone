const express = require("express");
const { addToWishlist, removeFromWishlist, getWishlist } = require("../Controllers/wishlistController");
const  fetchUser = require("../Middleware/fetchUser");

const router = express.Router();

router.post("/add", fetchUser, addToWishlist);
router.post("/remove", fetchUser, removeFromWishlist);
router.get("/", fetchUser, getWishlist);

module.exports = router;

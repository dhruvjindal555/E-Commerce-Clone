const Wishlist = require("../Models/WishlistSchema");
const Product = require("../Models/ProductSchema");

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [] });
        }

        // Check if product is already in wishlist
        if (wishlist.items.includes(productId)) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }

        wishlist.items.push(productId);
        await wishlist.save();

        res.status(200).json({ message: "Product added to wishlist", wishlist: wishlist.items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.items = wishlist.items.filter(id => id.toString() !== productId);
        await wishlist.save();

        res.status(200).json({ message: "Product removed from wishlist", wishlist: wishlist.items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ user: userId }).populate("items");
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        res.status(200).json({ wishlist: wishlist.items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };

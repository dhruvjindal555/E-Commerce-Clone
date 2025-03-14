const User = require('../Models/UserSchema');
const Joi = require('joi');

// Define the validation schema using Joi
const userSchema = Joi.object({
    fullName: Joi.string().min(1).required().messages({
        'string.empty': 'Full name is required',
        'any.required': 'Full name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    phoneNumber: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.empty': 'Phone Number is required',
        'string.pattern.base': 'Phone number must be a 10-digit number',
        'any.required': 'Phone number is required'
    }),
    profileUrl: Joi.string().allow("").optional(),
    address: Joi.object({
        street: Joi.string().min(1).required().messages({
            'string.empty': 'Street address is required',
            'any.required': 'Street address is required'
        }),
        city: Joi.string().min(1).required().messages({
            'string.empty': 'City is required',
            'any.required': 'City is required'
        }),
        state: Joi.string().optional(),
        pinCode: Joi.string().pattern(/^\d{6}$/).required().messages({
            'string.pattern.base': 'Pin code must be a 6-digit number',
            'any.required': 'Pin code is required'
        }),
        country: Joi.string().min(1).required().messages({
            'string.empty': 'Country is required',
            'any.required': 'Country is required'
        })
    }).required(),
    role: Joi.string().optional()
});

// Fetch user details by ID
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from request object
        const user = await User.findById(userId).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
// Fetch user details by ID
exports.getAllUsers = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from request object
        const user = await User.findById(userId).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        if (user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
        const users = await User.find();
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
// Update user details
exports.updateUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from request parameters

        // Validate incoming data against the schema (excluding profileUrl)
        // console.log(req.body);        
        const { error } = userSchema.validate(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json({ message: error.details.map(err => err.message) });
        }
        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { ...req.body },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
// Update user details
exports.updateUserByAdmin = async (req, res) => {
    try {
        const adminId = req.user.id; // Get user ID from request parameters
        const admin = await User.findById(adminId)
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        console.log(admin);
        if (admin.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized admin' });
        }
        // Validate incoming data against the schema (excluding profileUrl)
        // console.log(req.body);        
        const userId = req.params.id
        const { error } = userSchema.validate(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json({ message: error.details.map(err => err.message) });
        }
        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { ...req.body },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Profile Image Upload
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Uploaded File Details:', req.file);

        // Return Cloudinary's secure URL
        return res.status(200).json({ profileUrl: req.file.path });
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUserByAdmin = async (req, res) => {
    try {
        const adminId = req.user.id;
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        console.log(admin);
        if (admin.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized admin' });
        }
        
        
        const userId = req.params.id;        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User deleted successfully by admin." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

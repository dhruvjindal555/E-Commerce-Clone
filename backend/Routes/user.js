const express = require('express');
const router = express.Router();
const userController = require('../Controllers/User'); 
const fetchUser = require('../Middleware/fetchUser'); 
const upload = require('../Middleware/multer'); // Import Multer middleware

// Route to get user details
router.get('/',fetchUser, userController.getUserDetails);

// Route to update user details
router.put('/',fetchUser, userController.updateUserDetails);

router.post('/upload-profile', fetchUser, upload.single('profileImage'), userController.uploadProfileImage);


module.exports = router;

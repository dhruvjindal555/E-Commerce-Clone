const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_profiles', // Folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Resize limit
  }
});

const upload = multer({ storage });

module.exports = upload;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Function to dynamically set the folder based on request field name
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "uploads"; // Default folder

    if (file.fieldname === "profileImage") {
      folder = "user_profiles";
    } else if (file.fieldname === "files") {
      folder = "reviews";
    } else if (file.fieldname === 'productImages') {
      folder = 'productImages'
    }

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

// Initialize Multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;

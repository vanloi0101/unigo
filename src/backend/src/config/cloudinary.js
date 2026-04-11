import { v2 as cloudinary } from "cloudinary";
import config from "./env.js";

// Validate Cloudinary credentials before configuring
if (!config.CLOUDINARY_CLOUD_NAME) {
  console.error("❌ CLOUDINARY_CLOUD_NAME is not set in .env file");
}
if (!config.CLOUDINARY_API_KEY) {
  console.error("❌ CLOUDINARY_API_KEY is not set in .env file");
}
if (!config.CLOUDINARY_API_SECRET) {
  console.error("❌ CLOUDINARY_API_SECRET is not set in .env file");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

console.log("✅ Cloudinary configured with cloud_name:", config.CLOUDINARY_CLOUD_NAME);

export default cloudinary;

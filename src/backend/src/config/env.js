import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  DATABASE_URL: process.env.DATABASE_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

// Validate required environment variables
if (!config.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not defined in .env file");
  process.exit(1);
}

// Validate Cloudinary configuration for image uploads
if (!config.CLOUDINARY_CLOUD_NAME || !config.CLOUDINARY_API_KEY || !config.CLOUDINARY_API_SECRET) {
  console.warn("⚠️  WARNING: Cloudinary credentials are incomplete!");
  console.warn(`   CLOUDINARY_CLOUD_NAME: ${config.CLOUDINARY_CLOUD_NAME ? "✓" : "❌ Missing"}`);  
  console.warn(`   CLOUDINARY_API_KEY: ${config.CLOUDINARY_API_KEY ? "✓" : "❌ Missing"}`);
  console.warn(`   CLOUDINARY_API_SECRET: ${config.CLOUDINARY_API_SECRET ? "✓" : "❌ Missing"}`);
  console.warn("   Image upload will fail until Cloudinary is properly configured in .env");
}

// Log Cloudinary setup on startup (without exposing secrets)
console.log("🔧 Cloudinary Setup:");
console.log(`   Cloud Name: ${config.CLOUDINARY_CLOUD_NAME || "NOT SET"}`);
console.log(`   API Key: ${config.CLOUDINARY_API_KEY ? "✓ Configured" : "❌ NOT SET"}`);
console.log(`   API Secret: ${config.CLOUDINARY_API_SECRET ? "✓ Configured" : "❌ NOT SET"}`);

export default config;

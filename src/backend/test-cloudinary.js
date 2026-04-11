import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

console.log("🔍 Kiểm tra Cloudinary Credentials:");
console.log(`   Cloud Name: ${CLOUD_NAME || "❌ MISSING"}`);
console.log(`   API Key: ${API_KEY || "❌ MISSING"}`);
console.log(`   API Secret: ${API_SECRET ? "✓" : "❌ MISSING"}`);

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

// Test upload
console.log("\n📤 Thử upload ảnh test...");

const testImageBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);

cloudinary.uploader.upload_stream(
  {
    folder: "unigo/test",
    resource_type: "auto",
  },
  (error, result) => {
    if (error) {
      console.error("❌ Upload failed:");
      console.error(`   Error: ${error.message}`);
      console.error(`   HTTP Code: ${error.http_code}`);
      console.error("\n💡 Giải pháp:");
      console.error("   1. Kiểm tra Cloud Name, API Key, API Secret có chính xác không");
      console.error("   2. Truy cập https://cloudinary.com/console để xác nhận credentials");
      console.error("   3. Đảm bảo API Key và API Secret phù hợp với Cloud Name");
      process.exit(1);
    } else {
      console.log("✅ Upload thành công!");
      console.log(`   URL: ${result.secure_url}`);
      console.log(`   Public ID: ${result.public_id}`);
      console.log("\n✓ Cloudinary credentials hợp lệ!");
      process.exit(0);
    }
  }
).end(testImageBuffer);

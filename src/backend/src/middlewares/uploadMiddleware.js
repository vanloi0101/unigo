import multer from "multer";
import path from "path";

// Configure multer for memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Chỉ có thể upload hình ảnh (JPEG, PNG, GIF, WebP)"
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Middleware to handle single file upload
export const uploadSingle = upload.single("image");

// Middleware to handle multiple file uploads
export const uploadMultiple = upload.array("images", 10);

// Custom error handling middleware for multer errors
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(400).json({
        success: false,
        message: "Kích thước tệp quá lớn (tối đa 5MB)",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Số lượng tệp vượt quá giới hạn",
      });
    }
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Lỗi khi upload tệp",
    });
  }

  next();
};

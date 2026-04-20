import express from "express";
import {
  getActiveBannerContent,
  getAllBannerContents,
  getBannerContentById,
  createBannerContent,
  updateBannerContent,
  deleteBannerContent,
  getAllBannerImages,
  uploadBannerImage,
  updateBannerImage,
  deleteBannerImage,
  updateBannerImageSortOrder,
  toggleBannerImageActive,
} from "../controllers/bannerController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { checkAdminRole } from "../middlewares/adminMiddleware.js";
import { uploadSingle, handleMulterError } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
// Get active banner for homepage display
router.get("/", getActiveBannerContent);

// ==================== ADMIN ROUTES - BANNER CONTENT ====================
// Get all banner contents (admin)
router.get("/admin/contents", authenticateToken, checkAdminRole, getAllBannerContents);

// Get banner content by ID (admin)
router.get("/admin/contents/:id", authenticateToken, checkAdminRole, getBannerContentById);

// Create new banner content (admin)
router.post("/admin/contents", authenticateToken, checkAdminRole, createBannerContent);

// Update banner content (admin)
router.put("/admin/contents/:id", authenticateToken, checkAdminRole, updateBannerContent);

// Delete banner content (admin)
router.delete("/admin/contents/:id", authenticateToken, checkAdminRole, deleteBannerContent);

// ==================== ADMIN ROUTES - BANNER IMAGES ====================
// Get all banner images (admin)
router.get("/admin/images", authenticateToken, checkAdminRole, getAllBannerImages);

// Upload new banner image (admin)
router.post(
  "/admin/images",
  authenticateToken,
  checkAdminRole,
  uploadSingle,
  handleMulterError,
  uploadBannerImage
);

// Update banner image (admin)
router.put(
  "/admin/images/:id",
  authenticateToken,
  checkAdminRole,
  uploadSingle,
  handleMulterError,
  updateBannerImage
);

// Delete banner image (admin)
router.delete("/admin/images/:id", authenticateToken, checkAdminRole, deleteBannerImage);

// Update sort order for multiple images (admin)
router.put("/admin/images/sort", authenticateToken, checkAdminRole, updateBannerImageSortOrder);

// Toggle banner image active status (admin)
router.put("/admin/images/:id/toggle", authenticateToken, checkAdminRole, toggleBannerImageActive);

export default router;

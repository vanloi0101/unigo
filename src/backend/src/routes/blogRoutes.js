import express from "express";
import {
  // Public
  getPublishedPosts,
  getFeaturedPosts,
  getLatestPosts,
  getPopularPosts,
  searchPosts,
  getPostsByCategory,
  getPostBySlug,
  // Admin
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleFeatured,
  bulkUpdateStatus,
  publishPost,
  unpublishPost,
  uploadContentImage,
} from "../controllers/postController.js";
import {
  // Public
  getActiveCategories,
  getCategoryTree,
  getCategoryBySlug,
  // Admin
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleActive as toggleCategoryActive,
  updateSortOrder,
} from "../controllers/categoryNewsController.js";
import {
  // Public
  getActiveAuthors,
  getTopAuthors,
  getAuthorBySlug,
  // Admin
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  toggleActive as toggleAuthorActive,
} from "../controllers/authorController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { checkAdminRole } from "../middlewares/adminMiddleware.js";
import { uploadPostImages, uploadMultiple, uploadSingle, handleMulterError } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ==================== PUBLIC ROUTES: POSTS ====================
// GET /api/posts - Lấy danh sách bài viết published
router.get("/posts", getPublishedPosts);

// GET /api/posts/featured - Lấy bài viết nổi bật
router.get("/posts/featured", getFeaturedPosts);

// GET /api/posts/latest - Lấy bài viết mới nhất
router.get("/posts/latest", getLatestPosts);

// GET /api/posts/popular - Lấy bài viết xem nhiều
router.get("/posts/popular", getPopularPosts);

// GET /api/posts/search?keyword= - Tìm kiếm bài viết
router.get("/posts/search", searchPosts);

// GET /api/posts/category/:slug - Lấy bài viết theo danh mục
router.get("/posts/category/:slug", getPostsByCategory);

// GET /api/posts/:slug - Lấy chi tiết bài viết (phải đặt sau các route cụ thể)
router.get("/posts/:slug", getPostBySlug);

// ==================== PUBLIC ROUTES: CATEGORIES ====================
// GET /api/blog/categories - Lấy danh sách danh mục active
router.get("/blog/categories", getActiveCategories);

// GET /api/blog/categories/tree - Lấy cây danh mục
router.get("/blog/categories/tree", getCategoryTree);

// GET /api/blog/categories/:slug - Lấy chi tiết danh mục
router.get("/blog/categories/:slug", getCategoryBySlug);

// ==================== PUBLIC ROUTES: AUTHORS ====================
// GET /api/authors - Lấy danh sách tác giả active
router.get("/authors", getActiveAuthors);

// GET /api/authors/top - Lấy top tác giả
router.get("/authors/top", getTopAuthors);

// GET /api/authors/:slug - Lấy chi tiết tác giả với bài viết
router.get("/authors/:slug", getAuthorBySlug);

// ==================== ADMIN ROUTES: POSTS ====================
// GET /api/admin/posts - Lấy tất cả bài viết (bao gồm draft)
router.get(
  "/admin/posts",
  authenticateToken,
  checkAdminRole,
  getAllPosts
);

// GET /api/admin/posts/:id - Lấy chi tiết bài viết theo ID
router.get(
  "/admin/posts/:id",
  authenticateToken,
  checkAdminRole,
  getPostById
);

// POST /api/admin/posts - Tạo bài viết mới
router.post(
  "/admin/posts",
  authenticateToken,
  checkAdminRole,
  uploadPostImages,
  handleMulterError,
  createPost
);

// PUT /api/admin/posts/:id - Cập nhật bài viết
router.put(
  "/admin/posts/:id",
  authenticateToken,
  checkAdminRole,
  uploadPostImages,
  handleMulterError,
  updatePost
);

// DELETE /api/admin/posts/:id - Xóa bài viết
router.delete(
  "/admin/posts/:id",
  authenticateToken,
  checkAdminRole,
  deletePost
);

// PATCH /api/admin/posts/:id/featured - Toggle featured
router.patch(
  "/admin/posts/:id/featured",
  authenticateToken,
  checkAdminRole,
  toggleFeatured
);

// PATCH /api/admin/posts/:id/publish - Publish a post
router.patch(
  "/admin/posts/:id/publish",
  authenticateToken,
  checkAdminRole,
  publishPost
);

// PATCH /api/admin/posts/:id/unpublish - Unpublish a post
router.patch(
  "/admin/posts/:id/unpublish",
  authenticateToken,
  checkAdminRole,
  unpublishPost
);

// PATCH /api/admin/posts/bulk-status - Bulk update status
router.patch(
  "/admin/posts/bulk-status",
  authenticateToken,
  checkAdminRole,
  bulkUpdateStatus
);

// POST /api/admin/upload-image - Upload images for content editor
router.post(
  "/admin/upload-image",
  authenticateToken,
  checkAdminRole,
  uploadMultiple,
  handleMulterError,
  uploadContentImage
);

// ==================== ADMIN ROUTES: CATEGORIES (Blog/News) ====================
// GET /api/admin/blog/categories - Lấy tất cả danh mục
router.get(
  "/admin/blog/categories",
  authenticateToken,
  checkAdminRole,
  getAllCategories
);

// GET /api/admin/blog/categories/:id - Lấy chi tiết danh mục theo ID
router.get(
  "/admin/blog/categories/:id",
  authenticateToken,
  checkAdminRole,
  getCategoryById
);

// POST /api/admin/blog/categories - Tạo danh mục mới
router.post(
  "/admin/blog/categories",
  authenticateToken,
  checkAdminRole,
  uploadSingle,
  handleMulterError,
  createCategory
);

// PUT /api/admin/blog/categories/:id - Cập nhật danh mục
router.put(
  "/admin/blog/categories/:id",
  authenticateToken,
  checkAdminRole,
  uploadSingle,
  handleMulterError,
  updateCategory
);

// DELETE /api/admin/blog/categories/:id - Xóa danh mục
router.delete(
  "/admin/blog/categories/:id",
  authenticateToken,
  checkAdminRole,
  deleteCategory
);

// PATCH /api/admin/blog/categories/:id/toggle-active - Toggle active
router.patch(
  "/admin/blog/categories/:id/toggle-active",
  authenticateToken,
  checkAdminRole,
  toggleCategoryActive
);

// PUT /api/admin/blog/categories/sort-order - Update sort order
router.put(
  "/admin/blog/categories/sort-order",
  authenticateToken,
  checkAdminRole,
  updateSortOrder
);

// ==================== ADMIN ROUTES: AUTHORS ====================
// GET /api/admin/authors - Lấy tất cả tác giả
router.get(
  "/admin/authors",
  authenticateToken,
  checkAdminRole,
  getAllAuthors
);

// GET /api/admin/authors/:id - Lấy chi tiết tác giả theo ID
router.get(
  "/admin/authors/:id",
  authenticateToken,
  checkAdminRole,
  getAuthorById
);

// POST /api/admin/authors - Tạo tác giả mới
router.post(
  "/admin/authors",
  authenticateToken,
  checkAdminRole,
  uploadSingle,
  handleMulterError,
  createAuthor
);

// PUT /api/admin/authors/:id - Cập nhật tác giả
router.put(
  "/admin/authors/:id",
  authenticateToken,
  checkAdminRole,
  uploadSingle,
  handleMulterError,
  updateAuthor
);

// DELETE /api/admin/authors/:id - Xóa tác giả
router.delete(
  "/admin/authors/:id",
  authenticateToken,
  checkAdminRole,
  deleteAuthor
);

// PATCH /api/admin/authors/:id/toggle-active - Toggle active
router.patch(
  "/admin/authors/:id/toggle-active",
  authenticateToken,
  checkAdminRole,
  toggleAuthorActive
);

export default router;

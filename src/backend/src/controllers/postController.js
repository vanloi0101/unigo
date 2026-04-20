import { postService } from "../services/postService.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Post Controller - Xử lý HTTP requests cho bài viết
 */

// ==================== HELPER: Upload image to Cloudinary ====================
const uploadImageToCloudinary = async (fileBuffer, folder = "unigo_blog") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// ==================== PUBLIC CONTROLLERS ====================

/**
 * GET /api/posts - Lấy danh sách bài viết (public)
 */
export const getPublishedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId } = req.query;
    
    const result = await postService.getPublishedPosts({
      page: parseInt(page),
      limit: parseInt(limit),
      categoryId: categoryId ? parseInt(categoryId) : null,
    });
    
    res.json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách bài viết",
      error: error.message,
    });
  }
};

/**
 * GET /api/posts/featured - Lấy bài viết nổi bật
 */
export const getFeaturedPosts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const posts = await postService.getFeaturedPosts(parseInt(limit));
    
    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error getting featured posts:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy bài viết nổi bật",
      error: error.message,
    });
  }
};

/**
 * GET /api/posts/latest - Lấy bài viết mới nhất
 */
export const getLatestPosts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const posts = await postService.getLatestPosts(parseInt(limit));
    
    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error getting latest posts:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy bài viết mới nhất",
      error: error.message,
    });
  }
};

/**
 * GET /api/posts/popular - Lấy bài viết được xem nhiều nhất
 */
export const getPopularPosts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const posts = await postService.getMostViewedPosts(parseInt(limit));
    
    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error getting popular posts:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy bài viết phổ biến",
      error: error.message,
    });
  }
};

/**
 * GET /api/posts/search - Tìm kiếm bài viết
 */
export const searchPosts = async (req, res) => {
  try {
    const { keyword = "", page = 1, limit = 10 } = req.query;
    
    const result = await postService.searchPosts({
      keyword,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    
    res.json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm bài viết",
      error: error.message,
    });
  }
};

/**
 * GET /api/posts/category/:slug - Lấy bài viết theo category
 */
export const getPostsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const result = await postService.getPostsByCategory({
      categorySlug: slug,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    
    if (!result.category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }
    
    res.json({
      success: true,
      data: result.posts,
      category: result.category,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error getting posts by category:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy bài viết theo danh mục",
      error: error.message,
    });
  }
};

/**
 * GET /api/posts/:slug - Lấy chi tiết bài viết
 */
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await postService.getPostBySlug(slug, true);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Bài viết không tồn tại",
      });
    }
    
    // Only return published posts for public
    if (post.status !== "PUBLISHED") {
      return res.status(404).json({
        success: false,
        message: "Bài viết không tồn tại",
      });
    }
    
    // Get related posts
    const relatedPosts = await postService.getRelatedPosts({
      postId: post.id,
      categoryId: post.categoryId,
      limit: 4,
    });
    
    res.json({
      success: true,
      data: post,
      relatedPosts,
    });
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết bài viết",
      error: error.message,
    });
  }
};

// ==================== ADMIN CONTROLLERS ====================

/**
 * GET /api/admin/posts - Lấy tất cả bài viết (admin)
 */
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, categoryId } = req.query;
    
    const result = await postService.getAllPosts({
      page: parseInt(page),
      limit: parseInt(limit),
      status: status || null,
      categoryId: categoryId ? parseInt(categoryId) : null,
    });
    
    res.json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error getting all posts:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách bài viết",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/posts/:id - Lấy chi tiết bài viết theo ID (admin)
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.getPostById(parseInt(id));
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Bài viết không tồn tại",
      });
    }
    
    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết bài viết",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/posts - Tạo bài viết mới
 */
export const createPost = async (req, res) => {
  try {
    const postData = req.body;
    
    // Handle thumbnail upload (from req.files.thumbnail)
    if (req.files?.thumbnail?.[0]) {
      const result = await uploadImageToCloudinary(req.files.thumbnail[0].buffer, "unigo_blog/thumbnails");
      postData.thumbnail = result.secure_url;
    }
    
    // Handle content images upload (from req.files.contentImages)
    if (req.files?.contentImages?.length > 0) {
      const uploadPromises = req.files.contentImages.map(file =>
        uploadImageToCloudinary(file.buffer, "unigo_blog/content")
      );
      const results = await Promise.all(uploadPromises);
      // Return URLs as JSON array stored in a field or append to content
      postData.contentImageUrls = JSON.stringify(results.map(r => r.secure_url));
    }
    
    // Parse numeric fields
    if (postData.categoryId) postData.categoryId = parseInt(postData.categoryId);
    if (postData.authorId) postData.authorId = parseInt(postData.authorId);
    if (postData.isFeatured) postData.isFeatured = postData.isFeatured === "true" || postData.isFeatured === true;
    if (postData.allowComments) postData.allowComments = postData.allowComments === "true" || postData.allowComments === true;
    
    const post = await postService.createPost(postData);
    
    res.status(201).json({
      success: true,
      message: "Tạo bài viết thành công",
      data: post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo bài viết",
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/posts/:id - Cập nhật bài viết
 */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postData = req.body;
    
    // Handle thumbnail upload (from req.files.thumbnail)
    if (req.files?.thumbnail?.[0]) {
      const result = await uploadImageToCloudinary(req.files.thumbnail[0].buffer, "unigo_blog/thumbnails");
      postData.thumbnail = result.secure_url;
    }
    
    // Handle content images upload (from req.files.contentImages)
    if (req.files?.contentImages?.length > 0) {
      const uploadPromises = req.files.contentImages.map(file =>
        uploadImageToCloudinary(file.buffer, "unigo_blog/content")
      );
      const results = await Promise.all(uploadPromises);
      postData.contentImageUrls = JSON.stringify(results.map(r => r.secure_url));
    }
    
    // Parse numeric fields
    if (postData.categoryId) postData.categoryId = parseInt(postData.categoryId);
    if (postData.authorId) postData.authorId = parseInt(postData.authorId);
    if (postData.isFeatured !== undefined) postData.isFeatured = postData.isFeatured === "true" || postData.isFeatured === true;
    if (postData.allowComments !== undefined) postData.allowComments = postData.allowComments === "true" || postData.allowComments === true;
    
    const post = await postService.updatePost(parseInt(id), postData);
    
    res.json({
      success: true,
      message: "Cập nhật bài viết thành công",
      data: post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    
    if (error.message === "Post not found") {
      return res.status(404).json({
        success: false,
        message: "Bài viết không tồn tại",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật bài viết",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/posts/:id - Xóa bài viết
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await postService.deletePost(parseInt(id));
    
    res.json({
      success: true,
      message: "Xóa bài viết thành công",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    
    if (error.message === "Post not found") {
      return res.status(404).json({
        success: false,
        message: "Bài viết không tồn tại",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa bài viết",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/posts/:id/featured - Toggle featured
 */
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.toggleFeatured(parseInt(id));
    
    res.json({
      success: true,
      message: post.isFeatured ? "Đã đánh dấu nổi bật" : "Đã bỏ đánh dấu nổi bật",
      data: post,
    });
  } catch (error) {
    console.error("Error toggling featured:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái nổi bật",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/posts/bulk-status - Bulk update status
 */
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn bài viết",
      });
    }
    
    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }
    
    const result = await postService.bulkUpdateStatus(ids.map(id => parseInt(id)), status);
    
    res.json({
      success: true,
      message: `Đã cập nhật ${result.count} bài viết`,
    });
  } catch (error) {
    console.error("Error bulk updating status:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/posts/:id/publish - Publish a post
 */
export const publishPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.publishPost(parseInt(id));
    
    res.json({
      success: true,
      message: "Đã công bố bài viết",
      data: post,
    });
  } catch (error) {
    console.error("Error publishing post:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi công bố bài viết",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/admin/posts/:id/unpublish - Unpublish a post
 */
export const unpublishPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.unpublishPost(parseInt(id));
    
    res.json({
      success: true,
      message: "Đã chuyển bài viết thành nháp",
      data: post,
    });
  } catch (error) {
    console.error("Error unpublishing post:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi chuyển bài viết thành nháp",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/upload-image - Upload image for content editor
 * Returns URLs of uploaded images
 */
export const uploadContentImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có ảnh được tải lên",
      });
    }
    
    // Upload all images to Cloudinary
    const uploadPromises = req.files.map(file =>
      uploadImageToCloudinary(file.buffer, "unigo_blog/content")
    );
    const results = await Promise.all(uploadPromises);
    
    // Return array of URLs
    const urls = results.map(r => r.secure_url);
    
    res.json({
      success: true,
      message: `Đã tải lên ${urls.length} ảnh`,
      data: {
        urls,
        // Return single url for compatibility with single upload
        url: urls[0],
      },
    });
  } catch (error) {
    console.error("Error uploading content image:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tải ảnh lên",
      error: error.message,
    });
  }
};

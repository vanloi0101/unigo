import { authorService } from "../services/authorService.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Author Controller - Xử lý HTTP requests cho tác giả
 */

// ==================== HELPER: Upload image to Cloudinary ====================
const uploadImageToCloudinary = async (fileBuffer, folder = "unigo_authors") => {
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
 * GET /api/authors - Lấy danh sách tác giả active
 */
export const getActiveAuthors = async (req, res) => {
  try {
    const authors = await authorService.getActiveAuthors();
    
    res.json({
      success: true,
      data: authors,
    });
  } catch (error) {
    console.error("Error getting authors:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách tác giả",
      error: error.message,
    });
  }
};

/**
 * GET /api/authors/top - Lấy top tác giả
 */
export const getTopAuthors = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const authors = await authorService.getTopAuthors(parseInt(limit));
    
    res.json({
      success: true,
      data: authors,
    });
  } catch (error) {
    console.error("Error getting top authors:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy top tác giả",
      error: error.message,
    });
  }
};

/**
 * GET /api/authors/:slug - Lấy chi tiết tác giả và bài viết
 */
export const getAuthorBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const result = await authorService.getAuthorWithPosts({
      authorSlug: slug,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    
    if (!result.author) {
      return res.status(404).json({
        success: false,
        message: "Tác giả không tồn tại",
      });
    }
    
    res.json({
      success: true,
      data: result.author,
      posts: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error getting author:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết tác giả",
      error: error.message,
    });
  }
};

// ==================== ADMIN CONTROLLERS ====================

/**
 * GET /api/admin/authors - Lấy tất cả tác giả (admin)
 */
export const getAllAuthors = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const result = await authorService.getAllAuthors({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    
    res.json({
      success: true,
      data: result.authors,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error getting all authors:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách tác giả",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/authors/:id - Lấy chi tiết tác giả theo ID
 */
export const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await authorService.getAuthorById(parseInt(id));
    
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Tác giả không tồn tại",
      });
    }
    
    res.json({
      success: true,
      data: author,
    });
  } catch (error) {
    console.error("Error getting author:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết tác giả",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/authors - Tạo tác giả mới
 */
export const createAuthor = async (req, res) => {
  try {
    const authorData = req.body;
    
    // Handle image upload if exists
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer);
      authorData.avatar = result.secure_url;
    }
    
    // Parse fields
    if (authorData.isActive !== undefined) authorData.isActive = authorData.isActive === "true" || authorData.isActive === true;
    
    const author = await authorService.createAuthor(authorData);
    
    res.status(201).json({
      success: true,
      message: "Tạo tác giả thành công",
      data: author,
    });
  } catch (error) {
    console.error("Error creating author:", error);
    
    if (error.message === "Email already exists") {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo tác giả",
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/authors/:id - Cập nhật tác giả
 */
export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const authorData = req.body;
    
    // Handle image upload if exists
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer);
      authorData.avatar = result.secure_url;
    }
    
    // Parse fields
    if (authorData.isActive !== undefined) authorData.isActive = authorData.isActive === "true" || authorData.isActive === true;
    
    const author = await authorService.updateAuthor(parseInt(id), authorData);
    
    res.json({
      success: true,
      message: "Cập nhật tác giả thành công",
      data: author,
    });
  } catch (error) {
    console.error("Error updating author:", error);
    
    if (error.message === "Author not found") {
      return res.status(404).json({
        success: false,
        message: "Tác giả không tồn tại",
      });
    }
    
    if (error.message === "Email already exists") {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật tác giả",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/authors/:id - Xóa tác giả
 */
export const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    await authorService.deleteAuthor(parseInt(id));
    
    res.json({
      success: true,
      message: "Xóa tác giả thành công",
    });
  } catch (error) {
    console.error("Error deleting author:", error);
    
    if (error.message === "Author not found") {
      return res.status(404).json({
        success: false,
        message: "Tác giả không tồn tại",
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /api/admin/authors/:id/toggle-active - Toggle active status
 */
export const toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await authorService.toggleActive(parseInt(id));
    
    res.json({
      success: true,
      message: author.isActive ? "Đã kích hoạt tác giả" : "Đã vô hiệu hóa tác giả",
      data: author,
    });
  } catch (error) {
    console.error("Error toggling active:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái",
      error: error.message,
    });
  }
};

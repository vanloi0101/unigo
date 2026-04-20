import { categoryNewsService } from "../services/categoryNewsService.js";
import cloudinary from "../config/cloudinary.js";

/**
 * CategoryNews Controller - Xử lý HTTP requests cho danh mục tin tức
 */

// ==================== HELPER: Upload image to Cloudinary ====================
const uploadImageToCloudinary = async (fileBuffer, folder = "unigo_blog_categories") => {
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
 * GET /api/categories - Lấy danh sách danh mục active
 */
export const getActiveCategories = async (req, res) => {
  try {
    const categories = await categoryNewsService.getActiveCategories();
    
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách danh mục",
      error: error.message,
    });
  }
};

/**
 * GET /api/categories/tree - Lấy cây danh mục (cho sidebar)
 */
export const getCategoryTree = async (req, res) => {
  try {
    const tree = await categoryNewsService.getCategoryTree();
    
    res.json({
      success: true,
      data: tree,
    });
  } catch (error) {
    console.error("Error getting category tree:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy cây danh mục",
      error: error.message,
    });
  }
};

/**
 * GET /api/categories/:slug - Lấy chi tiết danh mục theo slug
 */
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryNewsService.getCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }
    
    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết danh mục",
      error: error.message,
    });
  }
};

// ==================== ADMIN CONTROLLERS ====================

/**
 * GET /api/admin/categories - Lấy tất cả danh mục (admin)
 */
export const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const result = await categoryNewsService.getAllCategories({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    
    res.json({
      success: true,
      data: result.categories,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error getting all categories:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách danh mục",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/categories/:id - Lấy chi tiết danh mục theo ID
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryNewsService.getCategoryById(parseInt(id));
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }
    
    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết danh mục",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/categories - Tạo danh mục mới
 */
export const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    
    // Handle image upload if exists
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer);
      categoryData.thumbnail = result.secure_url;
    }
    
    // Parse fields
    if (categoryData.parentId) categoryData.parentId = parseInt(categoryData.parentId);
    if (categoryData.sortOrder) categoryData.sortOrder = parseInt(categoryData.sortOrder);
    if (categoryData.isActive !== undefined) categoryData.isActive = categoryData.isActive === "true" || categoryData.isActive === true;
    
    const category = await categoryNewsService.createCategory(categoryData);
    
    res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo danh mục",
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/categories/:id - Cập nhật danh mục
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    
    // Handle image upload if exists
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer);
      categoryData.thumbnail = result.secure_url;
    }
    
    // Parse fields
    if (categoryData.parentId) categoryData.parentId = parseInt(categoryData.parentId);
    else if (categoryData.parentId === "") categoryData.parentId = null;
    if (categoryData.sortOrder) categoryData.sortOrder = parseInt(categoryData.sortOrder);
    if (categoryData.isActive !== undefined) categoryData.isActive = categoryData.isActive === "true" || categoryData.isActive === true;
    
    const category = await categoryNewsService.updateCategory(parseInt(id), categoryData);
    
    res.json({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    
    if (error.message === "Category not found") {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật danh mục",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/categories/:id - Xóa danh mục
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryNewsService.deleteCategory(parseInt(id));
    
    res.json({
      success: true,
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    
    if (error.message === "Category not found") {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /api/admin/categories/:id/toggle-active - Toggle active status
 */
export const toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryNewsService.toggleActive(parseInt(id));
    
    res.json({
      success: true,
      message: category.isActive ? "Đã kích hoạt danh mục" : "Đã vô hiệu hóa danh mục",
      data: category,
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

/**
 * PUT /api/admin/categories/sort-order - Update sort order
 */
export const updateSortOrder = async (req, res) => {
  try {
    const { categories } = req.body;
    
    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
      });
    }
    
    await categoryNewsService.updateSortOrder(categories);
    
    res.json({
      success: true,
      message: "Cập nhật thứ tự thành công",
    });
  } catch (error) {
    console.error("Error updating sort order:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật thứ tự",
      error: error.message,
    });
  }
};

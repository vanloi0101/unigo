import prisma from "../config/database.js";

/**
 * Get all categories with optional filtering
 */
export const getAllCategories = async (req, res) => {
  try {
    const { isActive = true, sort = "sortOrder" } = req.query;

    const categories = await prisma.category.findMany({
      where: isActive !== "false" ? { isActive: true } : undefined,
      orderBy: sort === "name" ? { name: "asc" } : { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: categories,
      message: `Retrieved ${categories.length} categories`,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách danh mục",
      error: error.message,
    });
  }
};

/**
 * Get single category by ID
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    const category = await prisma.category.findUnique({
      where: { id: parsedId },
      include: {
        products: {
          select: { id: true, name: true, price: true, imageUrl: true },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh mục",
      error: error.message,
    });
  }
};

/**
 * Create new category
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, thumbnail, sortOrder = 0 } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục là bắt buộc",
      });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Danh mục này đã tồn tại",
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        thumbnail: thumbnail || null,
        sortOrder: parseInt(sortOrder) || 0,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
      message: "Danh mục được tạo thành công",
    });
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Danh mục này đã tồn tại",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo danh mục",
      error: error.message,
    });
  }
};

/**
 * Update category
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, thumbnail, sortOrder, isActive } = req.body;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    // Build update data
    const updateData = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder);
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: "Danh mục được cập nhật thành công",
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Slug danh mục này đã tồn tại",
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
 * Delete category
 * If category has products, move them to another category or keep them unassigned
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { moveTo = null, deleteProducts = false } = req.body;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại",
      });
    }

    // If category has products
    if (category._count.products > 0) {
      if (deleteProducts) {
        // Delete all products in this category
        await prisma.product.deleteMany({
          where: { categoryId: parseInt(id) },
        });
      } else if (moveTo) {
        // Move products to another category
        const targetCategory = await prisma.category.findUnique({
          where: { id: parseInt(moveTo) },
        });

        if (!targetCategory) {
          return res.status(400).json({
            success: false,
            message: "Danh mục đích không tồn tại",
          });
        }

        await prisma.product.updateMany({
          where: { categoryId: parseInt(id) },
          data: { categoryId: parseInt(moveTo) },
        });
      }
      // else: leave products unassigned (categoryId = null)
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Danh mục được xóa thành công",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    if (error.code === "P2014" || error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa danh mục này do ràng buộc dữ liệu",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa danh mục",
      error: error.message,
    });
  }
};

/**
 * Reorder categories (bulk update sort order)
 */
export const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: "Danh sách danh mục phải là array",
      });
    }

    // Update sortOrder for each category
    const updatePromises = categories.map((cat, index) =>
      prisma.category.update({
        where: { id: cat.id },
        data: { sortOrder: index },
      })
    );

    await Promise.all(updatePromises);

    const updatedCategories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });

    res.status(200).json({
      success: true,
      data: updatedCategories,
      message: "Danh mục được sắp xếp lại thành công",
    });
  } catch (error) {
    console.error("Reorder categories error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi sắp xếp lại danh mục",
      error: error.message,
    });
  }
};

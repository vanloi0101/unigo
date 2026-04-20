import prisma from "../config/database.js";
import { categoryNewsRepository } from "../repositories/categoryNewsRepository.js";

/**
 * CategoryNews Service - Business logic cho danh mục tin tức
 */

// ==================== SLUG UTILITIES ====================

const generateSlug = (name) => {
  const vietnameseMap = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'đ': 'd',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  };

  let slug = name.toLowerCase();
  for (const [viet, ascii] of Object.entries(vietnameseMap)) {
    slug = slug.replace(new RegExp(viet, 'g'), ascii);
  }
  
  return slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;
  
  while (await categoryNewsRepository.slugExists(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// ==================== SERVICE METHODS ====================

export const categoryNewsService = {
  /**
   * Tạo category mới
   */
  createCategory: async (data) => {
    const { name, ...rest } = data;
    
    const baseSlug = data.slug || generateSlug(name);
    const slug = await ensureUniqueSlug(baseSlug);
    
    return prisma.categoryNews.create({
      data: {
        name,
        slug,
        ...rest,
      },
      include: {
        parent: true,
      },
    });
  },

  /**
   * Cập nhật category
   */
  updateCategory: async (id, data) => {
    const { name, ...rest } = data;
    const existing = await prisma.categoryNews.findUnique({ where: { id } });
    
    if (!existing) {
      throw new Error("Category not found");
    }
    
    const updateData = { ...rest };
    
    if (name && name !== existing.name) {
      updateData.name = name;
      if (!data.slug) {
        const baseSlug = generateSlug(name);
        updateData.slug = await ensureUniqueSlug(baseSlug, id);
      }
    }
    
    if (data.slug && data.slug !== existing.slug) {
      updateData.slug = await ensureUniqueSlug(data.slug, id);
    }
    
    // Prevent circular reference
    if (data.parentId === id) {
      throw new Error("Category cannot be its own parent");
    }
    
    return prisma.categoryNews.update({
      where: { id },
      data: updateData,
      include: {
        parent: true,
      },
    });
  },

  /**
   * Xóa category
   */
  deleteCategory: async (id) => {
    const category = await prisma.categoryNews.findUnique({
      where: { id },
      include: { _count: { select: { posts: true, children: true } } },
    });
    
    if (!category) {
      throw new Error("Category not found");
    }
    
    if (category._count.posts > 0) {
      throw new Error("Cannot delete category with posts. Move or delete posts first.");
    }
    
    if (category._count.children > 0) {
      throw new Error("Cannot delete category with sub-categories. Delete sub-categories first.");
    }
    
    await prisma.categoryNews.delete({ where: { id } });
    return { success: true, message: "Category deleted successfully" };
  },

  /**
   * Lấy category theo slug
   */
  getCategoryBySlug: async (slug) => {
    return categoryNewsRepository.findBySlug(slug);
  },

  /**
   * Lấy category theo ID
   */
  getCategoryById: async (id) => {
    return prisma.categoryNews.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: { select: { posts: true } },
      },
    });
  },

  /**
   * Lấy tất cả categories active (public)
   */
  getActiveCategories: async () => {
    return categoryNewsRepository.findAllActive();
  },

  /**
   * Lấy category tree (cho sidebar)
   */
  getCategoryTree: async () => {
    return categoryNewsRepository.buildCategoryTree();
  },

  /**
   * Lấy root categories
   */
  getRootCategories: async () => {
    return categoryNewsRepository.findRootCategories();
  },

  /**
   * Admin: Lấy tất cả categories
   */
  getAllCategories: async ({ page = 1, limit = 50 }) => {
    return categoryNewsRepository.findAll({ page, limit });
  },

  /**
   * Toggle active status
   */
  toggleActive: async (id) => {
    const category = await prisma.categoryNews.findUnique({ where: { id } });
    if (!category) {
      throw new Error("Category not found");
    }
    
    return prisma.categoryNews.update({
      where: { id },
      data: { isActive: !category.isActive },
    });
  },

  /**
   * Update sort order
   */
  updateSortOrder: async (categories) => {
    const updates = categories.map(({ id, sortOrder }) =>
      prisma.categoryNews.update({
        where: { id },
        data: { sortOrder },
      })
    );
    
    return Promise.all(updates);
  },
};

export default categoryNewsService;

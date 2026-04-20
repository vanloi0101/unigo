import prisma from "../config/database.js";
import { authorRepository } from "../repositories/authorRepository.js";

/**
 * Author Service - Business logic cho tác giả
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
  
  while (await authorRepository.slugExists(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// ==================== SERVICE METHODS ====================

export const authorService = {
  /**
   * Tạo author mới
   */
  createAuthor: async (data) => {
    const { name, email, ...rest } = data;
    
    // Check email unique
    if (email && await authorRepository.emailExists(email)) {
      throw new Error("Email already exists");
    }
    
    const baseSlug = data.slug || generateSlug(name);
    const slug = await ensureUniqueSlug(baseSlug);
    
    return prisma.author.create({
      data: {
        name,
        slug,
        email,
        ...rest,
      },
    });
  },

  /**
   * Cập nhật author
   */
  updateAuthor: async (id, data) => {
    const { name, email, ...rest } = data;
    const existing = await prisma.author.findUnique({ where: { id } });
    
    if (!existing) {
      throw new Error("Author not found");
    }
    
    const updateData = { ...rest };
    
    // Check email unique
    if (email && email !== existing.email) {
      if (await authorRepository.emailExists(email, id)) {
        throw new Error("Email already exists");
      }
      updateData.email = email;
    }
    
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
    
    return prisma.author.update({
      where: { id },
      data: updateData,
    });
  },

  /**
   * Xóa author
   */
  deleteAuthor: async (id) => {
    const author = await prisma.author.findUnique({
      where: { id },
      include: { _count: { select: { posts: true } } },
    });
    
    if (!author) {
      throw new Error("Author not found");
    }
    
    if (author._count.posts > 0) {
      throw new Error("Cannot delete author with posts. Reassign posts first.");
    }
    
    await prisma.author.delete({ where: { id } });
    return { success: true, message: "Author deleted successfully" };
  },

  /**
   * Lấy author theo slug
   */
  getAuthorBySlug: async (slug) => {
    return authorRepository.findBySlug(slug);
  },

  /**
   * Lấy author theo ID
   */
  getAuthorById: async (id) => {
    return prisma.author.findUnique({
      where: { id },
      include: {
        _count: { select: { posts: true } },
      },
    });
  },

  /**
   * Lấy author với posts
   */
  getAuthorWithPosts: async ({ authorSlug, page = 1, limit = 10 }) => {
    return authorRepository.findWithPosts({ authorSlug, page, limit });
  },

  /**
   * Lấy tất cả authors active
   */
  getActiveAuthors: async () => {
    return authorRepository.findAllActive();
  },

  /**
   * Admin: Lấy tất cả authors
   */
  getAllAuthors: async ({ page = 1, limit = 20 }) => {
    return authorRepository.findAll({ page, limit });
  },

  /**
   * Lấy top authors
   */
  getTopAuthors: async (limit = 5) => {
    return authorRepository.getTopAuthors(limit);
  },

  /**
   * Toggle active status
   */
  toggleActive: async (id) => {
    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) {
      throw new Error("Author not found");
    }
    
    return prisma.author.update({
      where: { id },
      data: { isActive: !author.isActive },
    });
  },
};

export default authorService;

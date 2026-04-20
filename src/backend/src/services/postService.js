import prisma from "../config/database.js";
import { postRepository } from "../repositories/postRepository.js";

/**
 * Post Service - Business logic cho bài viết
 */

// ==================== SLUG UTILITIES ====================

/**
 * Tạo slug từ title (Vietnamese support)
 */
const generateSlug = (title) => {
  // Vietnamese character mapping
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

  let slug = title.toLowerCase();
  
  // Replace Vietnamese characters
  for (const [viet, ascii] of Object.entries(vietnameseMap)) {
    slug = slug.replace(new RegExp(viet, 'g'), ascii);
  }
  
  // Replace special characters with dash
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return slug;
};

/**
 * Đảm bảo slug unique
 */
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;
  
  while (await postRepository.slugExists(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

/**
 * Tính số từ trong content (strip HTML)
 */
const countWords = (content) => {
  if (!content) return 0;
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, ' ');
  // Count words
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
};

/**
 * Tính thời gian đọc (200 words/min)
 */
const calculateReadingTime = (wordCount) => {
  return Math.max(1, Math.ceil(wordCount / 200));
};

// ==================== SERVICE METHODS ====================

export const postService = {
  /**
   * Tạo bài viết mới
   */
  createPost: async (data) => {
    const { title, content, status = "DRAFT", categoryId, authorId, ...rest } = data;
    
    // Generate unique slug
    const baseSlug = data.slug || generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);
    
    // Calculate word count and reading time
    const wordCount = countWords(content);
    const estimatedReadingTime = calculateReadingTime(wordCount);
    
    // Set publishedAt if status is PUBLISHED
    const publishedAt = status === "PUBLISHED" ? new Date() : null;
    
    // Clean optional fields - convert empty strings to null
    const cleanData = { ...rest };
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === '' || cleanData[key] === undefined) {
        cleanData[key] = null;
      }
    });
    
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        wordCount,
        estimatedReadingTime,
        status,
        publishedAt,
        categoryId: categoryId ? parseInt(categoryId) : null,
        authorId: authorId ? parseInt(authorId) : null,
        ...cleanData,
      },
      include: {
        category: true,
        author: true,
      },
    });
    
    return post;
  },

  /**
   * Cập nhật bài viết
   */
  updatePost: async (id, data) => {
    const { title, content, status, categoryId, authorId, ...rest } = data;
    const existingPost = await prisma.post.findUnique({ where: { id } });
    
    if (!existingPost) {
      throw new Error("Post not found");
    }
    
    // Clean optional fields - convert empty strings to null
    const cleanRest = { ...rest };
    Object.keys(cleanRest).forEach(key => {
      if (cleanRest[key] === '' || cleanRest[key] === undefined) {
        cleanRest[key] = null;
      }
    });
    
    const updateData = { ...cleanRest };
    
    // Handle categoryId and authorId
    if (categoryId !== undefined) {
      updateData.categoryId = categoryId ? parseInt(categoryId) : null;
    }
    if (authorId !== undefined) {
      updateData.authorId = authorId ? parseInt(authorId) : null;
    }
    
    // Update slug if title changed
    if (title && title !== existingPost.title) {
      updateData.title = title;
      if (!data.slug) {
        const baseSlug = generateSlug(title);
        updateData.slug = await ensureUniqueSlug(baseSlug, id);
      }
    }
    
    // Update slug if explicitly provided
    if (data.slug && data.slug !== existingPost.slug) {
      updateData.slug = await ensureUniqueSlug(data.slug, id);
    }
    
    // Update word count and reading time if content changed
    if (content) {
      updateData.content = content;
      updateData.wordCount = countWords(content);
      updateData.estimatedReadingTime = calculateReadingTime(updateData.wordCount);
    }
    
    // Handle status change
    if (status) {
      updateData.status = status;
      // Set publishedAt when first published
      if (status === "PUBLISHED" && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    
    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        author: true,
      },
    });
    
    return post;
  },

  /**
   * Xóa bài viết
   */
  deletePost: async (id) => {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new Error("Post not found");
    }
    
    await prisma.post.delete({ where: { id } });
    return { success: true, message: "Post deleted successfully" };
  },

  /**
   * Lấy bài viết theo slug (tăng views)
   */
  getPostBySlug: async (slug, incrementView = true) => {
    const post = await postRepository.findBySlug(slug);
    
    if (!post) {
      return null;
    }
    
    // Increment views for published posts
    if (incrementView && post.status === "PUBLISHED") {
      await postRepository.incrementViews(post.id);
      post.views += 1;
    }
    
    return post;
  },

  /**
   * Lấy bài viết theo ID (admin)
   */
  getPostById: async (id) => {
    return prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
      },
    });
  },

  /**
   * Lấy bài viết nổi bật
   */
  getFeaturedPosts: async (limit = 5) => {
    return postRepository.findFeaturedPosts(limit);
  },

  /**
   * Lấy bài viết mới nhất
   */
  getLatestPosts: async (limit = 10) => {
    return postRepository.findLatest(limit);
  },

  /**
   * Lấy danh sách bài viết (public - chỉ published)
   */
  getPublishedPosts: async ({ page = 1, limit = 10, categoryId = null }) => {
    return postRepository.findPublished({ page, limit, categoryId });
  },

  /**
   * Lấy bài viết theo category slug
   */
  getPostsByCategory: async ({ categorySlug, page = 1, limit = 10 }) => {
    return postRepository.findByCategorySlug({ categorySlug, page, limit });
  },

  /**
   * Tìm kiếm bài viết
   */
  searchPosts: async ({ keyword, page = 1, limit = 10 }) => {
    if (!keyword || keyword.trim().length < 2) {
      return { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }
    return postRepository.searchPosts({ keyword: keyword.trim(), page, limit });
  },

  /**
   * Lấy bài viết liên quan
   */
  getRelatedPosts: async ({ postId, categoryId, limit = 4 }) => {
    if (!categoryId) return [];
    return postRepository.findRelatedPosts({ postId, categoryId, limit });
  },

  /**
   * Lấy bài viết được xem nhiều nhất
   */
  getMostViewedPosts: async (limit = 5) => {
    return postRepository.findMostViewed(limit);
  },

  /**
   * Admin: Lấy tất cả bài viết (bao gồm draft)
   */
  getAllPosts: async ({ page = 1, limit = 10, status = null, categoryId = null }) => {
    return postRepository.findAll({ page, limit, status, categoryId });
  },

  /**
   * Toggle featured status
   */
  toggleFeatured: async (id) => {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new Error("Post not found");
    }
    
    return prisma.post.update({
      where: { id },
      data: { isFeatured: !post.isFeatured },
    });
  },

  /**
   * Bulk update status
   */
  bulkUpdateStatus: async (ids, status) => {
    const updateData = { status };
    if (status === "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
    
    return prisma.post.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });
  },

  /**
   * Publish a post
   */
  publishPost: async (id) => {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new Error("Bài viết không tồn tại");
    }

    const updateData = { status: "PUBLISHED" };
    if (!post.publishedAt) {
      updateData.publishedAt = new Date();
    }

    return prisma.post.update({
      where: { id },
      data: updateData,
    });
  },

  /**
   * Unpublish a post (set to DRAFT)
   */
  unpublishPost: async (id) => {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new Error("Bài viết không tồn tại");
    }

    return prisma.post.update({
      where: { id },
      data: { status: "DRAFT" },
    });
  },
};

export default postService;

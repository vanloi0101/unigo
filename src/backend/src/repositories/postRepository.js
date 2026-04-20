import prisma from "../config/database.js";

/**
 * Post Repository - Custom queries cho Post
 */
export const postRepository = {
  // ==================== FIND BY SLUG ====================
  findBySlug: async (slug) => {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
      },
    });
  },

  // ==================== FIND FEATURED POSTS ====================
  findFeaturedPosts: async (limit = 5) => {
    return prisma.post.findMany({
      where: {
        isFeatured: true,
        status: "PUBLISHED",
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, slug: true, avatar: true },
        },
      },
    });
  },

  // ==================== FIND TOP FEATURED POST ====================
  findTopFeatured: async () => {
    return prisma.post.findFirst({
      where: {
        isFeatured: true,
        status: "PUBLISHED",
      },
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, slug: true, avatar: true },
        },
      },
    });
  },

  // ==================== FIND PUBLISHED POSTS (PAGINATION) ====================
  findPublished: async ({ page = 1, limit = 10, categoryId = null }) => {
    const skip = (page - 1) * limit;

    const where = {
      status: "PUBLISHED",
      ...(categoryId && { categoryId: parseInt(categoryId) }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        include: {
          category: true,
          author: {
            select: { id: true, name: true, slug: true, avatar: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // ==================== FIND BY CATEGORY SLUG ====================
  findByCategorySlug: async ({ categorySlug, page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    // Tìm category trước
    const category = await prisma.categoryNews.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return { posts: [], category: null, pagination: { page, limit, total: 0, totalPages: 0 } };
    }

    const where = {
      status: "PUBLISHED",
      categoryId: category.id,
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        include: {
          category: true,
          author: {
            select: { id: true, name: true, slug: true, avatar: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      category,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // ==================== FIND RELATED POSTS ====================
  findRelatedPosts: async ({ postId, categoryId, limit = 4 }) => {
    return prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        categoryId: categoryId,
        id: { not: postId }, // Không lấy chính bài viết đang xem
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, slug: true, avatar: true },
        },
      },
    });
  },

  // ==================== SEARCH POSTS BY KEYWORD ====================
  searchPosts: async ({ keyword, page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const where = {
      status: "PUBLISHED",
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { shortDescription: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
        { metaKeywords: { contains: keyword, mode: "insensitive" } },
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        include: {
          category: true,
          author: {
            select: { id: true, name: true, slug: true, avatar: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // ==================== INCREASE VIEWS ====================
  incrementViews: async (postId) => {
    return prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });
  },

  // ==================== ADMIN: FIND ALL (INCLUDE DRAFTS) ====================
  findAll: async ({ page = 1, limit = 10, status = null, categoryId = null }) => {
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(categoryId && { categoryId: parseInt(categoryId) }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          category: true,
          author: {
            select: { id: true, name: true, slug: true, avatar: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // ==================== GET LATEST POSTS ====================
  findLatest: async (limit = 5) => {
    return prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, slug: true, avatar: true },
        },
      },
    });
  },

  // ==================== GET MOST VIEWED POSTS ====================
  findMostViewed: async (limit = 5) => {
    return prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: limit,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, slug: true, avatar: true },
        },
      },
    });
  },

  // ==================== CHECK SLUG EXISTS ====================
  slugExists: async (slug, excludeId = null) => {
    const where = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const post = await prisma.post.findFirst({ where });
    return !!post;
  },
};

export default postRepository;

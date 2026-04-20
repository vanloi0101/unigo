import prisma from "../config/database.js";

/**
 * Author Repository - Custom queries cho Author
 */
export const authorRepository = {
  // ==================== FIND BY SLUG ====================
  findBySlug: async (slug) => {
    return prisma.author.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
    });
  },

  // ==================== FIND BY EMAIL ====================
  findByEmail: async (email) => {
    return prisma.author.findUnique({
      where: { email },
    });
  },

  // ==================== FIND ALL ACTIVE AUTHORS ====================
  findAllActive: async () => {
    return prisma.author.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            posts: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
    });
  },

  // ==================== ADMIN: FIND ALL (including inactive) ====================
  findAll: async ({ page = 1, limit = 20 }) => {
    const skip = (page - 1) * limit;

    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        orderBy: { name: "asc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: { posts: true },
          },
        },
      }),
      prisma.author.count(),
    ]);

    return {
      authors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // ==================== FIND AUTHOR WITH POSTS ====================
  findWithPosts: async ({ authorSlug, page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const author = await prisma.author.findUnique({
      where: { slug: authorSlug },
    });

    if (!author) {
      return { author: null, posts: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }

    const where = {
      status: "PUBLISHED",
      authorId: author.id,
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      author,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // ==================== CHECK SLUG EXISTS ====================
  slugExists: async (slug, excludeId = null) => {
    const where = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const author = await prisma.author.findFirst({ where });
    return !!author;
  },

  // ==================== CHECK EMAIL EXISTS ====================
  emailExists: async (email, excludeId = null) => {
    if (!email) return false;
    const where = { email };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const author = await prisma.author.findFirst({ where });
    return !!author;
  },

  // ==================== GET TOP AUTHORS BY POST COUNT ====================
  getTopAuthors: async (limit = 5) => {
    const authors = await prisma.author.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            posts: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
    });

    // Sort by post count and limit
    return authors
      .sort((a, b) => b._count.posts - a._count.posts)
      .slice(0, limit);
  },
};

export default authorRepository;

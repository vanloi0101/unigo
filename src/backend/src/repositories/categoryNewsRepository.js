import prisma from "../config/database.js";

/**
 * CategoryNews Repository - Custom queries cho CategoryNews
 */
export const categoryNewsRepository = {
  // ==================== FIND BY SLUG ====================
  findBySlug: async (slug) => {
    return prisma.categoryNews.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
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

  // ==================== FIND ALL ACTIVE CATEGORIES ====================
  findAllActive: async () => {
    return prisma.categoryNews.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        parent: true,
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

  // ==================== FIND ROOT CATEGORIES (no parent) ====================
  findRootCategories: async () => {
    return prisma.categoryNews.findMany({
      where: {
        isActive: true,
        parentId: null,
      },
      orderBy: { sortOrder: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            _count: {
              select: {
                posts: {
                  where: { status: "PUBLISHED" },
                },
              },
            },
          },
        },
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

  // ==================== BUILD CATEGORY TREE ====================
  buildCategoryTree: async () => {
    const categories = await prisma.categoryNews.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
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

    // Build tree structure
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: build tree
    categories.forEach((cat) => {
      const categoryWithChildren = categoryMap.get(cat.id);
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        categoryMap.get(cat.parentId).children.push(categoryWithChildren);
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  },

  // ==================== ADMIN: FIND ALL (including inactive) ====================
  findAll: async ({ page = 1, limit = 20 }) => {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.categoryNews.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        skip,
        take: limit,
        include: {
          parent: true,
          _count: {
            select: { posts: true },
          },
        },
      }),
      prisma.categoryNews.count(),
    ]);

    return {
      categories,
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
    const category = await prisma.categoryNews.findFirst({ where });
    return !!category;
  },

  // ==================== GET CATEGORY WITH POST COUNT ====================
  getCategoryWithPostCount: async (categoryId) => {
    return prisma.categoryNews.findUnique({
      where: { id: categoryId },
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
};

export default categoryNewsRepository;

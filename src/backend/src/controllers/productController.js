import prisma from "../config/database.js";
import cloudinary from "../config/cloudinary.js";

// ==================== HELPER FUNCTION ====================
// Upload image to Cloudinary from buffer
const uploadImageToCloudinary = async (fileBuffer, folder = "unigo/products") => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
          quality: "auto",
          fetch_format: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error(`Lỗi upload hình ảnh: ${error.message}`);
  }
};

// ==================== GET ALL PRODUCTS WITH SEARCH & FILTER ====================
export const getAllProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      minPrice = 0,
      maxPrice = 999999999,
      page = 1,
      limit = 10,
    } = req.query;

    // Convert to appropriate types
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * limitNum;
    const minPriceNum = parseFloat(minPrice) || 0;
    const maxPriceNum = parseFloat(maxPrice) || 999999999;

    // Build where clause for filtering
    const where = {
      AND: [
        // Search by name or description
        search
          ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
          : {},
        // Filter by category
        category
          ? {
            category: {
              equals: category,
              mode: "insensitive",
            },
          }
          : {},
        // Filter by price range
        {
          price: {
            gte: minPriceNum,
            lte: maxPriceNum,
          },
        },
      ],
    };

    // Fetch products with filters and pagination
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get total count for pagination
    const totalItems = await prisma.product.count({ where });
    const totalPages = Math.ceil(totalItems / limitNum);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// ==================== GET PRODUCT BY ID ====================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderItems: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tìm thấy",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// ==================== CREATE PRODUCT WITH IMAGE UPLOAD ====================
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Tên sản phẩm và giá là bắt buộc",
      });
    }

    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Chỉ admin mới có thể tạo sản phẩm",
      });
    }

    let imageUrl = null;

    // Upload image to Cloudinary if file exists
    if (req.file) {
      try {
        const cloudinaryResult = await uploadImageToCloudinary(req.file.buffer);
        imageUrl = cloudinaryResult.secure_url;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: `Lỗi upload hình ảnh: ${uploadError.message}`,
        });
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        stock: parseInt(stock) || 0,
        category,
      },
    });

    res.status(201).json({
      success: true,
      message: "Sản phẩm tạo thành công",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// ==================== UPDATE PRODUCT WITH IMAGE UPLOAD ====================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Chỉ admin mới có thể sửa sản phẩm",
      });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tìm thấy",
      });
    }

    const updateData = {};

    // Add fields to update if provided
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (category) updateData.category = category;

    // Handle image upload
    if (req.file) {
      try {
        // Delete old image from Cloudinary if it exists
        if (existingProduct.imageUrl) {
          try {
            // Extract public_id from URL
            const urlParts = existingProduct.imageUrl.split("/");
            const publicId = urlParts.slice(-2).join("/").split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (deleteError) {
            console.warn("Lỗi xóa ảnh cũ:", deleteError.message);
          }
        }

        // Upload new image
        const cloudinaryResult = await uploadImageToCloudinary(req.file.buffer);
        updateData.imageUrl = cloudinaryResult.secure_url;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: `Lỗi upload hình ảnh: ${uploadError.message}`,
        });
      }
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Sản phẩm cập nhật thành công",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// ==================== DELETE PRODUCT ====================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Chỉ admin mới có thể xóa sản phẩm",
      });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tìm thấy",
      });
    }

    // Delete image from Cloudinary if exists
    if (existingProduct.imageUrl) {
      try {
        const urlParts = existingProduct.imageUrl.split("/");
        const publicId = urlParts.slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.warn("Lỗi xóa ảnh từ Cloudinary:", deleteError.message);
      }
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Sản phẩm xóa thành công",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

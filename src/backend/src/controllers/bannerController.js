import prisma from "../config/database.js";
import cloudinary from "../config/cloudinary.js";
import { sendSuccess, sendCreated, sendError, sendNotFound } from "../utils/responseHelper.js";

// ==================== HELPER FUNCTION ====================
// Upload image to Cloudinary from buffer
const uploadImageToCloudinary = async (fileBuffer, folder = "unigo_banners") => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "image",
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

// ==================== BANNER CONTENT CRUD ====================

// GET active banner content (Public)
export const getActiveBannerContent = async (req, res) => {
  try {
    const bannerContent = await prisma.bannerContent.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    const bannerImages = await prisma.bannerImage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return sendSuccess(res, { content: bannerContent, images: bannerImages }, "Lấy banner thành công");
  } catch (error) {
    console.error("❌ Error getting banner:", error);
    return sendError(res, error.message);
  }
};

// GET all banner contents (Admin)
export const getAllBannerContents = async (req, res) => {
  try {
    const bannerContents = await prisma.bannerContent.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return sendSuccess(res, bannerContents, "Lấy danh sách banner thành công");
  } catch (error) {
    console.error("❌ Error getting banner contents:", error);
    return sendError(res, error.message);
  }
};

// GET banner content by ID (Admin)
export const getBannerContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const bannerContent = await prisma.bannerContent.findUnique({
      where: { id: parseInt(id) },
    });

    if (!bannerContent) {
      return sendNotFound(res, "Không tìm thấy nội dung banner");
    }

    return sendSuccess(res, bannerContent, "Lấy banner thành công");
  } catch (error) {
    console.error("❌ Error getting banner content:", error);
    return sendError(res, error.message);
  }
};

// POST create banner content (Admin)
export const createBannerContent = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      badge,
      buttonText,
      buttonLink,
      button2Text,
      button2Link,
      isActive = true,
    } = req.body;

    if (!title) {
      return sendError(res, "Tiêu đề banner là bắt buộc", 400);
    }

    // If this content should be active, deactivate others first
    if (isActive) {
      await prisma.bannerContent.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const bannerContent = await prisma.bannerContent.create({
      data: {
        title,
        subtitle,
        description,
        badge,
        buttonText,
        buttonLink,
        button2Text,
        button2Link,
        isActive: Boolean(isActive),
      },
    });

    return sendCreated(res, bannerContent, "Tạo banner thành công");
  } catch (error) {
    console.error("❌ Error creating banner content:", error);
    return sendError(res, error.message);
  }
};

// PUT update banner content (Admin)
export const updateBannerContent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      description,
      badge,
      buttonText,
      buttonLink,
      button2Text,
      button2Link,
      isActive,
    } = req.body;

    // Check if banner exists
    const existingBanner = await prisma.bannerContent.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBanner) {
      return sendNotFound(res, "Không tìm thấy nội dung banner");
    }

    // If setting this to active, deactivate others
    if (isActive === true || isActive === "true") {
      await prisma.bannerContent.updateMany({
        where: {
          isActive: true,
          id: { not: parseInt(id) },
        },
        data: { isActive: false },
      });
    }

    const bannerContent = await prisma.bannerContent.update({
      where: { id: parseInt(id) },
      data: {
        title,
        subtitle,
        description,
        badge,
        buttonText,
        buttonLink,
        button2Text,
        button2Link,
        isActive: isActive !== undefined ? Boolean(isActive === true || isActive === "true") : undefined,
      },
    });

    return sendSuccess(res, bannerContent, "Cập nhật banner thành công");
  } catch (error) {
    console.error("❌ Error updating banner content:", error);
    return sendError(res, error.message);
  }
};

// DELETE banner content (Admin)
export const deleteBannerContent = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBanner = await prisma.bannerContent.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBanner) {
      return sendNotFound(res, "Không tìm thấy nội dung banner");
    }

    await prisma.bannerContent.delete({
      where: { id: parseInt(id) },
    });

    return sendSuccess(res, null, "Xóa banner thành công");
  } catch (error) {
    console.error("❌ Error deleting banner content:", error);
    return sendError(res, error.message);
  }
};

// ==================== BANNER IMAGES CRUD ====================

// GET all banner images (Admin)
export const getAllBannerImages = async (req, res) => {
  try {
    const bannerImages = await prisma.bannerImage.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return sendSuccess(res, bannerImages, "Lấy danh sách ảnh banner thành công");
  } catch (error) {
    console.error("❌ Error getting banner images:", error);
    return sendError(res, error.message);
  }
};

// POST upload banner image (Admin)
export const uploadBannerImage = async (req, res) => {
  try {
    const { caption, sortOrder = 0, isActive = true } = req.body;

    if (!req.file) {
      return sendError(res, "Vui lòng chọn hình ảnh để upload", 400);
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadImageToCloudinary(req.file.buffer, "unigo_banners");

    const bannerImage = await prisma.bannerImage.create({
      data: {
        imageUrl: cloudinaryResult.secure_url,
        caption,
        sortOrder: parseInt(sortOrder) || 0,
        isActive: Boolean(isActive === true || isActive === "true"),
      },
    });

    return sendCreated(res, bannerImage, "Upload ảnh banner thành công");
  } catch (error) {
    console.error("❌ Error uploading banner image:", error);
    return sendError(res, error.message);
  }
};

// PUT update banner image (Admin)
export const updateBannerImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, sortOrder, isActive } = req.body;

    const existingImage = await prisma.bannerImage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingImage) {
      return sendNotFound(res, "Không tìm thấy ảnh banner");
    }

    // Handle new image upload if provided
    let imageUrl = existingImage.imageUrl;
    if (req.file) {
      const cloudinaryResult = await uploadImageToCloudinary(req.file.buffer, "unigo_banners");
      imageUrl = cloudinaryResult.secure_url;
    }

    const bannerImage = await prisma.bannerImage.update({
      where: { id: parseInt(id) },
      data: {
        imageUrl,
        caption: caption !== undefined ? caption : existingImage.caption,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existingImage.sortOrder,
        isActive: isActive !== undefined ? Boolean(isActive === true || isActive === "true") : existingImage.isActive,
      },
    });

    return sendSuccess(res, bannerImage, "Cập nhật ảnh banner thành công");
  } catch (error) {
    console.error("❌ Error updating banner image:", error);
    return sendError(res, error.message);
  }
};

// DELETE banner image (Admin)
export const deleteBannerImage = async (req, res) => {
  try {
    const { id } = req.params;

    const existingImage = await prisma.bannerImage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingImage) {
      return sendNotFound(res, "Không tìm thấy ảnh banner");
    }

    // Delete from Cloudinary (optional - extract public_id from URL)
    try {
      const urlParts = existingImage.imageUrl.split("/");
      const fileNameWithExt = urlParts[urlParts.length - 1];
      const publicId = `unigo_banners/${fileNameWithExt.split(".")[0]}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.warn("⚠️ Could not delete image from Cloudinary:", cloudinaryError.message);
    }

    await prisma.bannerImage.delete({
      where: { id: parseInt(id) },
    });

    return sendSuccess(res, null, "Xóa ảnh banner thành công");
  } catch (error) {
    console.error("❌ Error deleting banner image:", error);
    return sendError(res, error.message);
  }
};

// PUT update sort order for multiple images (Admin)
export const updateBannerImageSortOrder = async (req, res) => {
  try {
    const { images } = req.body; // Array of { id, sortOrder }

    if (!images || !Array.isArray(images)) {
      return sendError(res, "Vui lòng cung cấp danh sách ảnh với thứ tự", 400);
    }

    // Update each image's sort order
    const updatePromises = images.map((img) =>
      prisma.bannerImage.update({
        where: { id: parseInt(img.id) },
        data: { sortOrder: parseInt(img.sortOrder) },
      })
    );

    await Promise.all(updatePromises);

    // Get updated list
    const updatedImages = await prisma.bannerImage.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return sendSuccess(res, updatedImages, "Cập nhật thứ tự ảnh thành công");
  } catch (error) {
    console.error("❌ Error updating image sort order:", error);
    return sendError(res, error.message);
  }
};

// PUT toggle banner image active status (Admin)
export const toggleBannerImageActive = async (req, res) => {
  try {
    const { id } = req.params;

    const existingImage = await prisma.bannerImage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingImage) {
      return sendNotFound(res, "Không tìm thấy ảnh banner");
    }

    const bannerImage = await prisma.bannerImage.update({
      where: { id: parseInt(id) },
      data: { isActive: !existingImage.isActive },
    });

    return sendSuccess(res, bannerImage, `${bannerImage.isActive ? "Bật" : "Tắt"} hiển thị ảnh thành công`);
  } catch (error) {
    console.error("❌ Error toggling banner image:", error);
    return sendError(res, error.message);
  }
};

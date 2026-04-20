import { create } from 'zustand';
import { bannerAPI } from '../api/apiServices';

const useBannerStore = create((set, get) => ({
  // Banner Content (Active)
  bannerContent: null,
  bannerImages: [],
  
  // Admin - All Contents
  allContents: [],
  allImages: [],
  
  // Loading states
  isLoading: false,
  isLoadingContents: false,
  isLoadingImages: false,
  isSaving: false,
  
  // Error state
  error: null,

  // ==================== PUBLIC ACTIONS ====================
  
  // Fetch active banner for homepage display
  fetchActiveBanner: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await bannerAPI.getActive();
      const data = response?.data || response;
      
      set({
        bannerContent: data?.content || null,
        bannerImages: data?.images || [],
        isLoading: false,
      });
      
      return { content: data?.content, images: data?.images };
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tải banner',
        isLoading: false,
      });
      return null;
    }
  },

  // ==================== ADMIN ACTIONS - CONTENT ====================
  
  // Fetch all banner contents (admin)
  fetchAllContents: async () => {
    set({ isLoadingContents: true, error: null });
    try {
      const response = await bannerAPI.getAllContents();
      const data = response?.data || response;
      
      set({
        allContents: Array.isArray(data) ? data : [],
        isLoadingContents: false,
      });
      
      return data;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tải danh sách banner',
        isLoadingContents: false,
      });
      return [];
    }
  },

  // Create banner content (admin)
  createContent: async (contentData) => {
    set({ isSaving: true, error: null });
    try {
      const response = await bannerAPI.createContent(contentData);
      const newContent = response?.data || response;
      
      // Refresh the list
      await get().fetchAllContents();
      
      set({ isSaving: false });
      return { success: true, data: newContent };
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tạo banner',
        isSaving: false,
      });
      return { success: false, error: error?.response?.data?.message };
    }
  },

  // Update banner content (admin)
  updateContent: async (id, contentData) => {
    set({ isSaving: true, error: null });
    try {
      const response = await bannerAPI.updateContent(id, contentData);
      const updatedContent = response?.data || response;
      
      // Refresh the list
      await get().fetchAllContents();
      
      set({ isSaving: false });
      return { success: true, data: updatedContent };
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi cập nhật banner',
        isSaving: false,
      });
      return { success: false, error: error?.response?.data?.message };
    }
  },

  // Delete banner content (admin)
  deleteContent: async (id) => {
    set({ isSaving: true, error: null });
    try {
      await bannerAPI.deleteContent(id);
      
      // Refresh the list
      await get().fetchAllContents();
      
      set({ isSaving: false });
      return { success: true };
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi xóa banner',
        isSaving: false,
      });
      return { success: false, error: error?.response?.data?.message };
    }
  },

  // ==================== ADMIN ACTIONS - IMAGES ====================
  
  // Fetch all banner images (admin)
  fetchAllImages: async () => {
    set({ isLoadingImages: true, error: null });
    try {
      const response = await bannerAPI.getAllImages();
      const data = response?.data || response;
      
      set({
        allImages: Array.isArray(data) ? data : [],
        isLoadingImages: false,
      });
      
      return data;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi tải danh sách ảnh banner',
        isLoadingImages: false,
      });
      return [];
    }
  },

  // Upload banner image (admin)
  uploadImage: async (formData) => {
    set({ isSaving: true, error: null });
    try {
      const response = await bannerAPI.uploadImage(formData);
      const newImage = response?.data || response;
      
      // Refresh the list
      await get().fetchAllImages();
      
      set({ isSaving: false });
      return { success: true, data: newImage };
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi upload ảnh banner',
        isSaving: false,
      });
      return { success: false, error: error?.response?.data?.message };
    }
  },

  // Update banner image (admin)
  updateImage: async (id, formData) => {
    set({ isSaving: true, error: null });
    try {
      const response = await bannerAPI.updateImage(id, formData);
      const updatedImage = response?.data || response;
      
      // Refresh the list
      await get().fetchAllImages();
      
      set({ isSaving: false });
      return { success: true, data: updatedImage };
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi cập nhật ảnh banner',
        isSaving: false,
      });
      return { success: false, error: error?.response?.data?.message };
    }
  },

  // Delete banner image (admin)
  deleteImage: async (id) => {
    set({ isSaving: true, error: null });
    try {
      await bannerAPI.deleteImage(id);
      
      // Refresh the list
      await get().fetchAllImages();
      
      set({ isSaving: false });
      return { success: true };
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi xóa ảnh banner',
        isSaving: false,
      });
      return { success: false, error: error?.response?.data?.message };
    }
  },

  // Toggle image active status (admin)
  toggleImageActive: async (id) => {
    set({ isSaving: true, error: null });
    try {
      const response = await bannerAPI.toggleImageActive(id);
      
      // Update local state immediately for better UX
      const images = get().allImages.map(img => 
        img.id === id ? { ...img, isActive: !img.isActive } : img
      );
      set({ allImages: images, isSaving: false });
      
      return { success: true, data: response?.data || response };
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi toggle ảnh banner',
        isSaving: false,
      });
      return { success: false, error: error?.response?.data?.message };
    }
  },

  // Update sort order (admin)
  updateSortOrder: async (imagesWithOrder) => {
    set({ isSaving: true, error: null });
    try {
      const response = await bannerAPI.updateImageSortOrder(imagesWithOrder);
      const updatedImages = response?.data || response;
      
      set({
        allImages: Array.isArray(updatedImages) ? updatedImages : get().allImages,
        isSaving: false,
      });
      
      return { success: true, data: updatedImages };
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Lỗi khi cập nhật thứ tự ảnh',
        isSaving: false,
      });
      return { success: false, error: error?.response?.data?.message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useBannerStore;

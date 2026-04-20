import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FaImage, FaPlus, FaEdit, FaTrash, FaSave, FaEye, FaEyeSlash, 
  FaGripVertical, FaUpload, FaTimes, FaCheck, FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import useBannerStore from '../store/useBannerStore';

// ==================== BANNER CONTENT FORM ====================
function BannerContentForm({ content, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    badge: '',
    buttonText: '',
    buttonLink: '',
    button2Text: '',
    button2Link: '',
    isActive: true,
  });

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        subtitle: content.subtitle || '',
        description: content.description || '',
        badge: content.badge || '',
        buttonText: content.buttonText || '',
        buttonLink: content.buttonLink || '',
        button2Text: content.button2Text || '',
        button2Link: content.button2Link || '',
        isActive: content.isActive ?? true,
      });
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề banner');
      return;
    }
    onSave(formData, content?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Badge & Active Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Badge (text nhỏ phía trên)</label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            placeholder="VD: ✨ Collection 2026 Đã Ra Mắt"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition"
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-sm font-medium text-gray-700">Kích hoạt banner này</span>
          </label>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề chính *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="VD: Vòng tay xinh"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition"
          required
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề phụ</label>
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          placeholder="VD: Chạm đến trái tim"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="VD: Trang sức handmade thiết kế riêng. Chất liệu an toàn, không gỉ sét."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition resize-none"
        />
      </div>

      {/* Button 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nút CTA - Text</label>
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            placeholder="VD: Xem Bộ Sưu Tập"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nút CTA - Link</label>
          <input
            type="text"
            name="buttonLink"
            value={formData.buttonLink}
            onChange={handleChange}
            placeholder="VD: #products"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Button 2 (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nút phụ - Text (tùy chọn)</label>
          <input
            type="text"
            name="button2Text"
            value={formData.button2Text}
            onChange={handleChange}
            placeholder="VD: Câu chuyện của Mận"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nút phụ - Link (tùy chọn)</label>
          <input
            type="text"
            name="button2Link"
            value={formData.button2Link}
            onChange={handleChange}
            placeholder="VD: #about"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <FaSpinner className="animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <FaSave />
              {content?.id ? 'Cập nhật' : 'Tạo mới'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ==================== IMAGE UPLOAD COMPONENT ====================
function ImageUploader({ onUpload, isSaving }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file hình ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file tối đa 5MB');
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn hình ảnh');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('caption', caption);
    
    const result = await onUpload(formData);
    if (result.success) {
      setSelectedFile(null);
      setPreview(null);
      setCaption('');
      toast.success('Upload ảnh thành công!');
    } else {
      toast.error(result.error || 'Lỗi upload ảnh');
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive 
            ? 'border-brand-purple bg-brand-light' 
            : 'border-gray-300 hover:border-brand-purple'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow" />
            <p className="text-sm text-gray-600">{selectedFile?.name}</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearSelection(); }}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              <FaTimes className="inline mr-1" /> Bỏ chọn
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <FaUpload className="text-4xl text-gray-400 mx-auto" />
            <p className="text-gray-600">Kéo thả ảnh vào đây hoặc click để chọn</p>
            <p className="text-sm text-gray-400">PNG, JPG, GIF, WebP (tối đa 5MB)</p>
          </div>
        )}
      </div>

      {/* Caption & Upload */}
      {selectedFile && (
        <div className="flex gap-4">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (tùy chọn)"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
          />
          <button
            onClick={handleUpload}
            disabled={isSaving}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaUpload />}
            Upload
          </button>
        </div>
      )}
    </div>
  );
}

// ==================== IMAGE LIST ITEM ====================
function ImageListItem({ image, onToggle, onDelete, isSaving, dragHandleProps }) {
  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-lg border ${image.isActive ? 'border-green-300' : 'border-gray-200'} shadow-sm`}>
      {/* Drag Handle */}
      <div {...dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
        <FaGripVertical size={20} />
      </div>

      {/* Thumbnail */}
      <img
        src={image.imageUrl}
        alt={image.caption || 'Banner image'}
        className="w-20 h-20 object-cover rounded-lg"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{image.caption || 'Không có caption'}</p>
        <p className="text-sm text-gray-500">Thứ tự: {image.sortOrder}</p>
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          image.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {image.isActive ? <><FaEye /> Đang hiển thị</> : <><FaEyeSlash /> Đã ẩn</>}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggle(image.id)}
          disabled={isSaving}
          className={`p-2 rounded-lg transition ${
            image.isActive 
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
          title={image.isActive ? 'Ẩn ảnh' : 'Hiện ảnh'}
        >
          {image.isActive ? <FaEyeSlash /> : <FaEye />}
        </button>
        <button
          onClick={() => onDelete(image.id)}
          disabled={isSaving}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
          title="Xóa ảnh"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

// ==================== BANNER PREVIEW ====================
function BannerPreview({ content, images }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeImages = images.filter(img => img.isActive);

  useEffect(() => {
    if (activeImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeImages.length]);

  return (
    <div className="bg-gradient-to-br from-brand-light to-white rounded-xl p-8 border border-gray-200">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Content Side */}
        <div className="flex-1 text-center md:text-left">
          {content?.badge && (
            <span className="inline-block py-1 px-3 rounded-full bg-white border border-brand-pink text-brand-purple text-sm font-semibold mb-4 shadow-sm">
              {content.badge}
            </span>
          )}
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-brand-dark leading-tight">
            {content?.title || 'Tiêu đề banner'}
            {content?.subtitle && (
              <>
                <br />
                <span className="text-gradient">{content.subtitle}</span>
              </>
            )}
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            {content?.description || 'Mô tả banner sẽ hiển thị ở đây...'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {content?.buttonText && (
              <a href={content.buttonLink || '#'} className="bg-brand-dark text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-black transition">
                {content.buttonText}
              </a>
            )}
            {content?.button2Text && (
              <a href={content.button2Link || '#'} className="bg-white text-brand-dark border-2 border-brand-dark/10 px-6 py-3 rounded-full font-semibold text-sm hover:border-brand-dark transition">
                {content.button2Text}
              </a>
            )}
          </div>
        </div>

        {/* Image Slider Side */}
        <div className="flex-1 relative">
          {activeImages.length > 0 ? (
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src={activeImages[currentSlide]?.imageUrl}
                alt={activeImages[currentSlide]?.caption || 'Banner'}
                className="w-full h-64 md:h-80 object-cover transition-opacity duration-500"
              />
              
              {/* Indicators */}
              {activeImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {activeImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition ${
                        idx === currentSlide ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Navigation Arrows */}
              {activeImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide(prev => (prev - 1 + activeImages.length) % activeImages.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => (prev + 1) % activeImages.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-2xl h-64 md:h-80 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FaImage size={48} className="mx-auto mb-4" />
                <p>Chưa có ảnh banner</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function AdminBanner() {
  const {
    allContents,
    allImages,
    isLoadingContents,
    isLoadingImages,
    isSaving,
    error,
    fetchAllContents,
    fetchAllImages,
    createContent,
    updateContent,
    deleteContent,
    uploadImage,
    deleteImage,
    toggleImageActive,
    updateSortOrder,
    clearError,
  } = useBannerStore();

  const [selectedContent, setSelectedContent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetchAllContents();
    fetchAllImages();
  }, [fetchAllContents, fetchAllImages]);

  // Auto-select active content or first content
  useEffect(() => {
    if (allContents.length > 0 && !selectedContent) {
      const active = allContents.find(c => c.isActive);
      setSelectedContent(active || allContents[0]);
    }
  }, [allContents, selectedContent]);

  // Handle save content
  const handleSaveContent = async (formData, contentId) => {
    let result;
    if (contentId) {
      result = await updateContent(contentId, formData);
    } else {
      result = await createContent(formData);
    }

    if (result.success) {
      toast.success(contentId ? 'Cập nhật banner thành công!' : 'Tạo banner thành công!');
      if (!contentId) {
        setSelectedContent(result.data);
      }
    } else {
      toast.error(result.error || 'Có lỗi xảy ra');
    }
  };

  // Handle delete content
  const handleDeleteContent = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return;
    
    const result = await deleteContent(id);
    if (result.success) {
      toast.success('Xóa banner thành công!');
      if (selectedContent?.id === id) {
        setSelectedContent(allContents.find(c => c.id !== id) || null);
      }
    } else {
      toast.error(result.error || 'Có lỗi xảy ra');
    }
  };

  // Handle delete image
  const handleDeleteImage = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    
    const result = await deleteImage(id);
    if (result.success) {
      toast.success('Xóa ảnh thành công!');
    } else {
      toast.error(result.error || 'Có lỗi xảy ra');
    }
  };

  // Handle toggle image
  const handleToggleImage = async (id) => {
    const result = await toggleImageActive(id);
    if (result.success) {
      toast.success('Đã cập nhật trạng thái ảnh');
    } else {
      toast.error(result.error || 'Có lỗi xảy ra');
    }
  };

  // Simple drag & drop reorder (basic implementation)
  const moveImage = (fromIndex, toIndex) => {
    const reordered = [...allImages];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    
    const imagesWithOrder = reordered.map((img, idx) => ({
      id: img.id,
      sortOrder: idx,
    }));
    
    updateSortOrder(imagesWithOrder);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản Lý Banner</h1>
          <p className="text-gray-600 mt-2">Chỉnh sửa nội dung và hình ảnh banner trang chủ</p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
            showPreview 
              ? 'bg-brand-purple text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FaEye />
          {showPreview ? 'Ẩn Preview' : 'Xem Preview'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Preview Section */}
      {showPreview && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaEye className="text-brand-purple" />
            Preview Banner
          </h2>
          <BannerPreview content={selectedContent} images={allImages} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Management Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaEdit className="text-brand-purple" />
            Nội Dung Banner
          </h2>

          {/* Content List */}
          {allContents.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn banner để chỉnh sửa</label>
              <div className="flex flex-wrap gap-2">
                {allContents.map(content => (
                  <button
                    key={content.id}
                    onClick={() => setSelectedContent(content)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedContent?.id === content.id
                        ? 'bg-brand-purple text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {content.title}
                    {content.isActive && <FaCheck className="inline ml-2 text-xs" />}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedContent(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition flex items-center gap-1"
                >
                  <FaPlus /> Tạo mới
                </button>
              </div>
            </div>
          )}

          {/* Content Form */}
          {isLoadingContents ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-4xl text-brand-purple" />
            </div>
          ) : (
            <BannerContentForm
              content={selectedContent}
              onSave={handleSaveContent}
              isSaving={isSaving}
            />
          )}

          {/* Delete Button */}
          {selectedContent?.id && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => handleDeleteContent(selectedContent.id)}
                disabled={isSaving}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
              >
                <FaTrash />
                Xóa banner này
              </button>
            </div>
          )}
        </div>

        {/* Image Management Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaImage className="text-brand-purple" />
            Quản Lý Ảnh Slider
          </h2>

          {/* Image Upload */}
          <ImageUploader onUpload={uploadImage} isSaving={isSaving} />

          {/* Image List */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Danh sách ảnh ({allImages.length})
            </h3>
            
            {isLoadingImages ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin text-2xl text-brand-purple" />
              </div>
            ) : allImages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaImage className="text-4xl mx-auto mb-3 text-gray-300" />
                <p>Chưa có ảnh banner nào</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allImages.map((image, index) => (
                  <ImageListItem
                    key={image.id}
                    image={image}
                    onToggle={handleToggleImage}
                    onDelete={handleDeleteImage}
                    isSaving={isSaving}
                    dragHandleProps={{
                      onDragStart: () => {},
                      onDragEnd: () => {},
                    }}
                  />
                ))}
              </div>
            )}

            {/* Sort order hint */}
            {allImages.length > 1 && (
              <p className="text-xs text-gray-500 mt-4">
                💡 Tip: Để sắp xếp thứ tự ảnh, bạn có thể cập nhật sortOrder trong cơ sở dữ liệu 
                hoặc liên hệ admin để cài đặt tính năng kéo thả.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

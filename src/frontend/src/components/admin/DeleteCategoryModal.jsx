import React, { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * DeleteCategoryModal Component
 * Smart delete modal that handles categories with products
 */
const DeleteCategoryModal = ({
  category,
  categories = [],
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const [action, setAction] = useState('unassign'); // 'unassign', 'move', 'delete'
  const [moveToCategory, setMoveToCategory] = useState(null);

  const hasProducts = category?.products?.length > 0 || category?._count?.products > 0;
  const productCount = category?._count?.products || category?.products?.length || 0;

  // Filter out current category from options
  const availableCategories = categories.filter(c => c.id !== category?.id);

  const handleConfirm = () => {
    if (hasProducts) {
      if (action === 'move') {
        if (!moveToCategory) {
          toast.error('Vui lòng chọn danh mục đích');
          return;
        }
        onConfirm({
          moveTo: moveToCategory,
          deleteProducts: false,
        });
      } else if (action === 'delete') {
        onConfirm({
          moveTo: null,
          deleteProducts: true,
        });
      } else {
        // unassign
        onConfirm({
          moveTo: null,
          deleteProducts: false,
        });
      }
    } else {
      onConfirm({
        moveTo: null,
        deleteProducts: false,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex gap-3 mb-4">
          <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
            <FaExclamationTriangle className="text-red-600 text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              Xóa danh mục "{category?.name}"?
            </h3>
          </div>
        </div>

        {/* Warning Message */}
        <p className="text-sm text-gray-600 mb-4">
          Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.
        </p>

        {/* Products Warning */}
        {hasProducts && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-yellow-800 mb-4">
              ⚠️ Danh mục này chứa <strong>{productCount}</strong> sản phẩm. Bạn muốn làm gì với chúng?
            </p>

            {/* Action Options */}
            <div className="space-y-3">
              {/* Option 1: Unassign */}
              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-yellow-100 rounded-lg">
                <input
                  type="radio"
                  name="action"
                  value="unassign"
                  checked={action === 'unassign'}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Bỏ gắn danh mục
                  </p>
                  <p className="text-xs text-gray-600">
                    Sản phẩm vẫn tồn tại nhưng không thuộc danh mục nào
                  </p>
                </div>
              </label>

              {/* Option 2: Move to another category */}
              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-yellow-100 rounded-lg">
                <input
                  type="radio"
                  name="action"
                  value="move"
                  checked={action === 'move'}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Chuyển sang danh mục khác
                  </p>
                  {action === 'move' && availableCategories.length > 0 && (
                    <select
                      value={moveToCategory || ''}
                      onChange={(e) => setMoveToCategory(parseInt(e.target.value))}
                      className="w-full mt-2 text-xs px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {availableCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {action === 'move' && availableCategories.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      Không có danh mục khác để chuyển
                    </p>
                  )}
                </div>
              </label>

              {/* Option 3: Delete products */}
              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-red-100 rounded-lg">
                <input
                  type="radio"
                  name="action"
                  value="delete"
                  checked={action === 'delete'}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-600">
                    🗑️ Xóa tất cả sản phẩm
                  </p>
                  <p className="text-xs text-red-600">
                    Sản phẩm sẽ bị xóa hoàn toàn (không thể khôi phục)
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {isLoading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;

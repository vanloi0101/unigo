import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MdDragIndicator } from 'react-icons/md';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * SortableCategory Component
 * Draggable category row with edit/delete actions
 */
const SortableCategory = ({ category, onEdit, onDelete, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isBeingDragged,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isBeingDragged ? 0.5 : 1,
  };

  const productCount = category._count?.products || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition ${
        isBeingDragged ? 'bg-blue-50 border-b-2 border-blue-300' : 'border-b'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
        title="Kéo để sắp xếp lại"
      >
        <MdDragIndicator className="text-lg" />
      </div>

      {/* Thumbnail */}
      {category.thumbnail && (
        <img
          src={category.thumbnail}
          alt={category.name}
          className="w-12 h-12 rounded object-cover bg-gray-200"
        />
      )}
      {!category.thumbnail && (
        <div className="w-12 h-12 rounded bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
          {category.name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Category Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-gray-600 truncate mt-1">
            {category.description}
          </p>
        )}
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span>{productCount} sản phẩm</span>
          <span className={`font-medium ${category.isActive ? 'text-green-600' : 'text-red-600'}`}>
            {category.isActive ? '✓ Hoạt động' : '✗ Vô hiệu hóa'}
          </span>
        </div>
      </div>

      {/* Sort Order */}
      <div className="text-center px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600 whitespace-nowrap">
        STT: {category.sortOrder}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          disabled={isDragging}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
          title="Chỉnh sửa"
        >
          <FiEdit2 className="text-lg" />
        </button>
        <button
          onClick={onDelete}
          disabled={isDragging}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
          title="Xóa"
        >
          <FiTrash2 className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default SortableCategory;

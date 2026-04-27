import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import toast from 'react-hot-toast';

import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useReorderCategories } from '../hooks/useCategories';
import CategoryForm from '../components/admin/CategoryForm';
import DeleteCategoryModal from '../components/admin/DeleteCategoryModal';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import SortableCategory from '../components/admin/SortableCategory';

/**
 * AdminCategories Page
 * Full CRUD management with drag & drop reordering
 */
export default function AdminCategories() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [localCategories, setLocalCategories] = useState([]);
  const [isReordering, setIsReordering] = useState(false);

  // Queries & Mutations
  const { data: categoriesData, isLoading, error } = useCategories();
  const createCategory = useCreateCategory({
    onSuccess: () => {
      toast.success('Danh mục được tạo thành công');
      setShowForm(false);
      setEditingCategory(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Lỗi khi tạo danh mục');
    },
  });

  const updateCategory = useUpdateCategory(editingCategory?.id, {
    onSuccess: () => {
      toast.success('Danh mục được cập nhật thành công');
      setShowForm(false);
      setEditingCategory(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật danh mục');
    },
  });

  const deleteCategory = useDeleteCategory({
    onSuccess: () => {
      toast.success('Danh mục được xóa thành công');
      setDeletingCategory(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa danh mục');
    },
  });

  const reorderCategories = useReorderCategories({
    onSuccess: () => {
      toast.success('Sắp xếp lại danh mục thành công');
      setIsReordering(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Lỗi khi sắp xếp lại');
      setIsReordering(false);
    },
  });

  // Sync local categories with API data
  useEffect(() => {
    if (categoriesData?.data) {
      setLocalCategories(categoriesData.data);
    }
  }, [categoriesData]);

  // Drag & Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localCategories.findIndex(c => c.id === active.id);
      const newIndex = localCategories.findIndex(c => c.id === over.id);

      const newOrder = arrayMove(localCategories, oldIndex, newIndex);
      setLocalCategories(newOrder);

      // Call API to save new order
      setIsReordering(true);
      reorderCategories.mutate(newOrder);
    }
  };

  // Handle form submit
  const handleFormSubmit = (formData) => {
    if (editingCategory) {
      updateCategory.mutate(formData);
    } else {
      createCategory.mutate(formData);
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = (options) => {
    deleteCategory.mutate({
      categoryId: deletingCategory.id,
      ...options,
    });
  };

  // Handle edit
  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý danh mục</h1>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} type="card" className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý danh mục</h1>
        <EmptyState type="error" actionPath="/admin" />
      </div>
    );
  }

  const categories = localCategories || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600 text-sm mt-1">
            {categories.length} danh mục
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition"
          >
            <FiPlus className="text-lg" />
            Thêm danh mục
          </button>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
          </h2>
          <CategoryForm
            category={editingCategory}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isLoading={createCategory.isPending || updateCategory.isPending}
          />
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <EmptyState type="categories" />
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categories.map(c => c.id)}
              strategy={verticalListSortingStrategy}
              disabled={isReordering}
            >
              <div className="divide-y">
                {categories.map((category) => (
                  <SortableCategory
                    key={category.id}
                    category={category}
                    onEdit={() => handleEdit(category)}
                    onDelete={() => setDeletingCategory(category)}
                    isDragging={isReordering}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Delete Modal */}
      {deletingCategory && (
        <DeleteCategoryModal
          category={deletingCategory}
          categories={categories}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCategory(null)}
          isLoading={deleteCategory.isPending}
        />
      )}
    </div>
  );
}

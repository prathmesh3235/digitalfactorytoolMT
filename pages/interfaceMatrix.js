import React, { useState, useEffect } from 'react';
import { ArrowRight, Edit2, Trash2, Plus, AlertCircle, Check } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { getPhaseMatrix, createMatrixCategory, updateMatrixCategory, deleteMatrixCategory } from '../utils/matrix';

const MatrixComponent = () => {
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [matrixData, setMatrixData] = useState(null);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fixedCategories = [
    { type: 'potential_equivalent', title: 'Potential Equivalent Phase' },
    { type: 'key_outputs', title: 'Key Outputs/Concepts' },
    { type: 'feedback', title: 'Feedback to Product Development' },
    { type: 'influence', title: 'Influence on Factory Planning' },
    { type: 'outcomes', title: 'Outcomes' }
  ];

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchPhases();
  }, []);

  useEffect(() => {
    if (selectedPhase) {
      fetchMatrixData();
    }
  }, [selectedPhase]);

  const fetchPhases = async () => {
    try {
      const response = await axiosInstance.get('/phases');
      setPhases(response.data);
    } catch (error) {
      console.error('Failed to fetch phases:', error);
      setError('Failed to fetch phases');
    }
  };

  const fetchMatrixData = async () => {
    setLoading(true);
    try {
      const response = await getPhaseMatrix(selectedPhase);
      setMatrixData(response);
      setError(null);
    } catch (error) {
      setError('Failed to fetch matrix data');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsEditing(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteMatrixCategory(categoryId);
      fetchMatrixData();
    } catch (error) {
      setError('Failed to delete category');
    }
  };

  const handleSave = async () => {
    try {
      if (editingCategory.id) {
        await updateMatrixCategory(editingCategory.id, editingCategory);
      } else {
        await createMatrixCategory({
          ...editingCategory,
          phase_id: selectedPhase
        });
      }
      setIsEditing(false);
      setEditingCategory(null);
      fetchMatrixData();
    } catch (error) {
      setError('Failed to save category');
    }
  };

  const handleAdd = (categoryType) => {
    setEditingCategory({
      category_type: categoryType,
      title: '',
      description: '',
      detail_text: ''
    });
    setIsEditing(true);
  };

  const handleMiddleTitleUpdate = async (categoryType, newTitle) => {
    try {
      await axiosInstance.patch(`/matrix/category-titles/${selectedPhase}`, {
        categoryType,
        title: newTitle
      });
      fetchMatrixData();
    } catch (error) {
      setError('Failed to update category title');
    }
  };

  return (
    
    <div className="min-h-screen bg-white p-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex">
        {/* Left Side Navigation */}


        <div className="w-72 pr-8">
  <div className="space-y-3">
    {phases.map(phase => (
      <button
        key={phase.id}
        onClick={() => setSelectedPhase(phase.id)}
        className={`w-full relative ${
          selectedPhase === phase.id
            ? 'bg-blue-500 text-white'
            : 'bg-gray-50 hover:bg-blue-50 text-gray-700'
        } transition-colors`}
        style={{
          clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)',
          padding: '1rem 2rem',
          minHeight: '3.5rem'
        }}
      >
        <span className="block font-medium text-left">
          {phase.title}
        </span>
      </button>
    ))}
  </div>
</div>


        {/* Matrix Content */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {fixedCategories.map(category => (
                <MatrixRow
                key={category.type}
                leftTitle={category.title}
                data={matrixData?.categories?.[category.type]?.[0]}
                categoryType={category.type}
                isAdmin={isLoggedIn}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => handleAdd(category.type)}
                onMiddleTitleUpdate={handleMiddleTitleUpdate}
              />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory.id ? 'Edit Category' : 'Add New Category'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border rounded"
                value={editingCategory.title || ''}
                onChange={e => setEditingCategory({
                  ...editingCategory,
                  title: e.target.value
                })}
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={editingCategory.description || ''}
                onChange={e => setEditingCategory({
                  ...editingCategory,
                  description: e.target.value
                })}
              />
              <textarea
                placeholder="Detailed Text"
                className="w-full p-2 border rounded"
                value={editingCategory.detail_text || ''}
                onChange={e => setEditingCategory({
                  ...editingCategory,
                  detail_text: e.target.value
                })}
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

const MatrixRow = ({ 
  leftTitle, 
  data, 
  categoryType, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onAdd 
}) => {
  const [isEditingMiddle, setIsEditingMiddle] = useState(false);
  const [middleTitle, setMiddleTitle] = useState(leftTitle);

  const handleMiddleSave = () => {
    // We'll need to implement this functionality
    console.log('Saving middle title:', middleTitle);
    setIsEditingMiddle(false);
  };

  return (
    <div className="flex items-start group min-h-[100px]"> {/* Added min-height */}
      {/* Middle Column - Fixed width */}
      <div className="relative w-80 flex-shrink-0 mr-8"> {/* Added flex-shrink-0 and fixed width */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-full">
          {isEditingMiddle && isAdmin ? (
            <div className="flex items-center">
              <input
                type="text"
                value={middleTitle}
                onChange={(e) => setMiddleTitle(e.target.value)}
                className="w-full p-1 border rounded"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleMiddleSave();
                }}
              />
              <button
                onClick={handleMiddleSave}
                className="ml-2 text-green-600 hover:text-green-700"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">{middleTitle}</h3>
              {isAdmin && (
                <button
                  onClick={() => setIsEditingMiddle(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 size={16} className="text-gray-600 hover:text-blue-600" />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="absolute right-[-32px] top-1/2 transform -translate-y-1/2 w-[32px] flex items-center">
          <div className="w-full h-[2px] bg-gray-400" /> {/* Thicker line */}
          <div className="absolute right-0 w-0 h-0 
            border-t-[6px] border-t-transparent
            border-l-[10px] border-l-gray-400
            border-b-[6px] border-b-transparent"
          />
        </div>

      </div>

      {/* Right Content - Fixed minimum width */}
      <div className="flex-1 min-w-[400px] bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative"> {/* Added min-width */}
        {isAdmin && (
          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {data ? (
              <>
                <button
                  onClick={() => onEdit(data)}
                  className="p-1 text-gray-600 hover:text-blue-600"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(data.id)}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={onAdd}
                className="p-1 text-gray-600 hover:text-green-600"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        )}
        
        {data ? (
          <div className="min-h-[60px]"> {/* Added minimum height */}
            <h3 className="font-medium text-gray-900 mb-2">{data.title}</h3>
            <p className="text-gray-600 text-sm">{data.detail_text}</p>
          </div>
        ) : (
          <div className="flex items-center text-gray-500 min-h-[60px]"> {/* Added minimum height */}
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>No data available</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default MatrixComponent;


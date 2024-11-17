import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';

// Icons as simple SVG components
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
      <div className="relative">
        {children}
      </div>
    </div>
  </div>
);

const AIPotentialBlock = ({ potential, isEditing, onEdit, onDelete, expanded, onToggle }) => (
  <div 
    className={`
      relative w-full bg-white rounded-lg shadow-md border-l-4 border-[#00AB8E] 
      hover:shadow-lg transition-all duration-300 cursor-pointer
      ${expanded ? 'ring-2 ring-[#00AB8E] ring-opacity-50' : ''}
    `}
    onClick={onToggle}
  >
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">{potential.title}</h3>
          <p className={`text-sm text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
            {potential.description}
          </p>
        </div>
        {isEditing && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(potential);
              }}
              className="p-2 hover:bg-gray-100 rounded-full text-[#00AB8E] transition-colors"
            >
              <EditIcon />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(potential.id);
              }}
              className="p-2 hover:bg-gray-100 rounded-full text-red-500 transition-colors"
            >
              <DeleteIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const AIPotentialsSection = ({ phaseId, isEditing }) => {
  const [potentials, setPotentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPotential, setEditingPotential] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchPotentials();
  }, [phaseId]);

  const fetchPotentials = async () => {
    try {
      const response = await axios.get(`/potential/${phaseId}`);
      setPotentials(response.data);
    } catch (err) {
      setError('Failed to load AI potentials');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      category: e.target.category.value,
      title: e.target.title.value,
      description: e.target.description.value,
      phaseId
    };

    try {
      if (editingPotential?.id) {
        await axios.patch(`/potential/${editingPotential.id}`, formData);
      } else {
        await axios.post('/potential', formData);
      }
      await fetchPotentials();
      setEditingPotential(null);
      showNotification('Changes saved successfully');
    } catch (err) {
      showNotification('Failed to save changes', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this potential?')) {
      try {
        await axios.delete(`/potential/${id}`);
        await fetchPotentials();
        showNotification('Potential deleted successfully');
      } catch (err) {
        showNotification('Failed to delete potential', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00AB8E] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-[#00AB8E] text-xl font-semibold mb-2">AI Potentials</h2>
          <p className="text-gray-600 text-sm">Advanced AI capabilities for optimizing factory planning processes</p>
        </div>
        {isEditing && (
          <button
            onClick={() => setEditingPotential({})}
            className="bg-[#00AB8E] text-white px-4 py-2 rounded-lg hover:bg-[#009579] transition-colors"
          >
            Add Potential
          </button>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`
          p-4 mb-4 rounded-lg transition-all duration-300
          ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
        `}>
          {notification.message}
        </div>
      )}

      {/* Potentials Grid */}
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#00AB8E] bg-opacity-20"></div>
        
        <div className="space-y-8">
          {potentials.map((potential, index) => (
            <div key={potential.id || index} className="relative grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-[#00AB8E] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
              
              <div className={`text-right pr-8 ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                <h3 className="font-medium text-[#00AB8E]">{potential.category}</h3>
              </div>

              <div className={`${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                <AIPotentialBlock
                  potential={potential}
                  isEditing={isEditing}
                  onEdit={setEditingPotential}
                  onDelete={handleDelete}
                  expanded={expandedId === potential.id}
                  onToggle={() => setExpandedId(expandedId === potential.id ? null : potential.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPotential && (
        <Modal onClose={() => setEditingPotential(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">
              {editingPotential.id ? 'Edit' : 'Add'} AI Potential
            </h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                defaultValue={editingPotential.category}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#00AB8E] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={editingPotential.title}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#00AB8E] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                defaultValue={editingPotential.description}
                className="w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-[#00AB8E] focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setEditingPotential(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00AB8E] text-white rounded-lg hover:bg-[#009579] transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AIPotentialsSection;
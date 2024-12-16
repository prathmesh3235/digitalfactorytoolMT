import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const PhaseDetails = ({ activePhase, isLoggedIn, isEditing }) => {
  const [expandedPhases, setExpandedPhases] = useState({});
  const [subphases, setSubphases] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    name: '',
    details: []
  });

  useEffect(() => {
    if (!isEditing) {
      setEditMode(null);
      setEditData({ name: '', details: [] });
    }
  }, [isEditing]);

  useEffect(() => {
    if (activePhase?.id) {
      fetchSubphases();
    }
  }, [activePhase?.id]);

  const fetchSubphases = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/phases/${activePhase.id}/subphases`);
      setSubphases(response.data);
    } catch (error) {
      console.error('Failed to fetch subphases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (subphaseId) => {
    if (!isEditing) return;
    
    try {
      if (!editData.name.trim()) {
        alert('Please enter a name for the subphase');
        return;
      }

      if (subphaseId === 'new') {
        await axiosInstance.post(`/phases/${activePhase.id}/subphases`, {
          ...editData,
          orderNumber: subphases.length + 1
        });
      } else {
        await axiosInstance.patch(`/phases/${activePhase.id}/subphases/${subphaseId}`, editData);
      }
      setEditMode(null);
      setEditData({ name: '', details: [] });
      await fetchSubphases();
    } catch (error) {
      console.error('Failed to save subphase:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleDelete = async (subphaseId) => {
    if (!isEditing) return;

    if (window.confirm('Are you sure you want to delete this subphase?')) {
      try {
        await axiosInstance.delete(`/phases/${activePhase.id}/subphases/${subphaseId}`);
        await fetchSubphases();
      } catch (error) {
        console.error('Failed to delete subphase:', error);
        alert('Failed to delete subphase. Please try again.');
      }
    }
  };

  const addNewSubphase = () => {
    if (!isEditing) return;
    
    setEditMode('new');
    setEditData({
      name: '',
      details: ['']
    });
  };

  const togglePhase = (phase) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };

  const handleAddDetail = () => {
    setEditData({
      ...editData,
      details: [...editData.details, '']
    });
  };

  const handleRemoveDetail = (index) => {
    const newDetails = editData.details.filter((_, i) => i !== index);
    setEditData({
      ...editData,
      details: newDetails
    });
  };

  const handleDetailChange = (index, value) => {
    const newDetails = [...editData.details];
    newDetails[index] = value;
    setEditData({
      ...editData,
      details: newDetails
    });
  };

  if (!activePhase || loading) return null;

  return (
    <div className="mt-8 w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-[#00AB8E] p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {activePhase.name}: Detailed Workflow
        </h2>
        {isLoggedIn && isEditing && (
          <button
            onClick={addNewSubphase}
            className="bg-white text-[#00AB8E] px-3 py-1 rounded-md flex items-center gap-2 hover:bg-gray-100"
          >
            <Plus size={16} />
            Add Subphase
          </button>
        )}
      </div>
      
      <div className="divide-y divide-gray-200">
        {editMode === 'new' && (
          <div className="p-4 bg-gray-50">
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter subphase name"
            />
            {editData.details.map((detail, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={detail}
                  onChange={(e) => handleDetailChange(i, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter detail"
                />
                <button
                  onClick={() => handleRemoveDetail(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddDetail}
                className="text-[#00AB8E] hover:text-[#009579]"
              >
                Add Detail
              </button>
              <button
                onClick={() => handleSave('new')}
                className="bg-[#00AB8E] text-white px-3 py-1 rounded hover:bg-[#009579]"
              >
                <Save size={16} />
              </button>
              <button
                onClick={() => setEditMode(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {subphases.map((subphase, index) => (
          <div key={subphase.id} className="hover:bg-gray-50 transition-colors duration-150">
            {editMode === subphase.id ? (
              <div className="p-4">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Subphase name"
                />
                {editData.details.map((detail, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) => handleDetailChange(i, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Detail"
                    />
                    <button
                      onClick={() => handleRemoveDetail(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddDetail}
                    className="text-[#00AB8E] hover:text-[#009579]"
                  >
                    Add Detail
                  </button>
                  <button
                    onClick={() => handleSave(subphase.id)}
                    className="bg-[#00AB8E] text-white px-3 py-1 rounded hover:bg-[#009579]"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => togglePhase(index)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center bg-[#00AB8E] text-white rounded-full mr-3 text-sm">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">{subphase.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLoggedIn && isEditing && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditMode(subphase.id);
                            setEditData({
                              name: subphase.name,
                              details: [...subphase.details]
                            });
                          }}
                          className="text-gray-500 hover:text-[#00AB8E]"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(subphase.id);
                          }}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    {expandedPhases[index] ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {expandedPhases[index] && (
                  <div className="px-16 pb-4 text-gray-600">
                    <ul className="list-disc space-y-2">
                      {subphase.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseDetails;
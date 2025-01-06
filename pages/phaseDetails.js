import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

// Loading screen component
const LoadingScreen = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00AB8E]"></div>
  </div>
);

const PhaseDetails = ({ activePhase, isLoggedIn, isEditing }) => {
  const [expandedPhases, setExpandedPhases] = useState({});
  const [subphases, setSubphases] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
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
    setTransitioning(true);
    setTimeout(() => {
      setExpandedPhases((prev) => ({
        ...prev,
        [phase]: !prev[phase]
      }));
      setTransitioning(false);
    }, 150);
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

  if (!activePhase) return null;
  if (loading) return <LoadingScreen />;

  return (
    <div className="mt-8 w-full max-w-5xl mx-auto">
      <div className="bg-[#00AB8E] p-4 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-l font-semibold">
            Subphases for {activePhase.name}
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
      </div>

      <div className="bg-white rounded-b-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
          {editMode === 'new' && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
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
            <div
              key={subphase.id}
              className="bg-gray-100 rounded-lg border border-gray-200 overflow-hidden"
            >
              {editMode === subphase.id ? (
                <div className="p-4">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Subphase name"
                  />
                  <div className="flex gap-2 mt-4">
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
                <div>
                  <div className="bg-[#00AB8E] text-white p-2 flex justify-between items-center">
                    <span>LP {index + 1}</span>
                    {isLoggedIn && isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditMode(subphase.id);
                            setEditData({
                              name: subphase.name,
                              details: [...subphase.details]
                            });
                          }}
                          className="text-white hover:text-gray-200"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(subphase.id)}
                          className="text-white hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-medium">{subphase.name}</div>
                    {expandedPhases[index] && (
                      <div className="mt-2 text-sm text-gray-600">
                        <ul className="list-disc pl-4">
                          {subphase.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button
                      onClick={() => togglePhase(index)}
                      className="mt-2 text-[#00AB8E] hover:text-[#009579] flex items-center gap-1"
                    >
                      {expandedPhases[index] ? (
                        <>
                          <ChevronUp size={16} />
                          <span>Show less</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} />
                          <span>Show more</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhaseDetails;
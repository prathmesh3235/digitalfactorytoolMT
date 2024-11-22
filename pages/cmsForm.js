import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const Notification = ({ type, message, onClose }) => (
  <div className={`mb-4 p-4 rounded ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    <div className="flex justify-between items-center">
      <p>{message}</p>
      <button onClick={onClose} className="text-sm">&times;</button>
    </div>
  </div>
);

export default function PhaseForm() {
  // Existing state variables
  const [selectedPhase, setSelectedPhase] = useState('');
  const [phaseNo, setPhaseNo] = useState('');
  const [title, setTitle] = useState('');
  const [profileInfo, setProfileInfo] = useState('');
  const [activeTab, setActiveTab] = useState('phase');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [phases, setPhases] = useState([]);
  
  // AI Potential form fields
  const [potentialCategory, setPotentialCategory] = useState('');
  const [potentialTitle, setPotentialTitle] = useState('');
  const [potentialDescription, setPotentialDescription] = useState('');
  const [potentials, setPotentials] = useState([]);

  // Add Phase form fields
  const [newPhaseNo, setNewPhaseNo] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newProfileInfo, setNewProfileInfo] = useState('');

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const response = await axiosInstance.get('/phases');
        setPhases(response.data);
      } catch (error) {
        console.error('Failed to fetch phases:', error);
      }
    };
    fetchPhases();
  }, []);

  useEffect(() => {
    const fetchPotentials = async () => {
      if (selectedPhase) {
        try {
          const response = await axiosInstance.get(`/potential/${selectedPhase}`);
          setPotentials(response.data);
        } catch (error) {
          console.error('Failed to fetch potentials:', error);
        }
      }
    };
    fetchPotentials();
  }, [selectedPhase]);

  const handlePhaseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      phaseNo,
      title,
      profile_info: profileInfo,
    };
    try {
      const response = await axiosInstance.post('/phases', payload);
      setNotification({ show: true, message: 'Phase created successfully!', type: 'success' });
      setPhaseNo('');
      setTitle('');
      setProfileInfo('');
      
      const updatedPhases = await axiosInstance.get('/phases');
      setPhases(updatedPhases.data);
    } catch (error) {
      setNotification({ show: true, message: 'Failed to create phase', type: 'error' });
    }
  };

  const handleAIPotentialSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPhase) {
      setNotification({ show: true, message: 'Please select a phase', type: 'error' });
      return;
    }

    try {
      const payload = {
        phaseId: selectedPhase,
        category: potentialCategory,
        title: potentialTitle,
        description: potentialDescription
      };

      const response = await axiosInstance.post('/potential', payload);

      if (response.status === 201) {
        setNotification({ show: true, message: 'AI Potential added successfully!', type: 'success' });
        setPotentialCategory('');
        setPotentialTitle('');
        setPotentialDescription('');
        
        const updatedPotentials = await axiosInstance.get(`/potential/${selectedPhase}`);
        setPotentials(updatedPotentials.data);
      }
    } catch (error) {
      setNotification({ show: true, message: 'Failed to add AI Potential', type: 'error' });
    }
  };

  const handleNewPhaseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      phaseNo: newPhaseNo,
      title: newTitle,
      profile_info: newProfileInfo,
    };
    try {
      const response = await axiosInstance.post('/phases', payload);
      setNotification({ show: true, message: 'Phase created successfully!', type: 'success' });
      setNewPhaseNo('');
      setNewTitle('');
      setNewProfileInfo('');
      
      const updatedPhases = await axiosInstance.get('/phases');
      setPhases(updatedPhases.data);
    } catch (error) {
      setNotification({ show: true, message: 'Failed to create phase', type: 'error' });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {notification.show && (
          <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification({ ...notification, show: false })}
          />
        )}

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === 'phase' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveTab('phase')}
          >
            Phase Information
          </button>
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === 'aiPotential' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveTab('aiPotential')}
          >
            AI Potential
          </button>
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === 'addPhase' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveTab('addPhase')}
          >
            Add Phase
          </button>
        </div>

        {activeTab === 'phase' ? (
          <form onSubmit={handlePhaseSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phase No:</label>
              <input
                type="text"
                value={phaseNo}
                onChange={(e) => setPhaseNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Profile Info:</label>
              <input
                type="text"
                value={profileInfo}
                onChange={(e) => setProfileInfo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={!phaseNo || !title || !profileInfo}
            >
              Submit Phase
            </button>
          </form>
        ) : activeTab === 'aiPotential' ? (
          <form onSubmit={handleAIPotentialSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Phase:</label>
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select a phase</option>
                {phases.map(phase => (
                  <option key={phase.id} value={phase.id}>
                    Phase {phase.phaseNo} - {phase.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category:</label>
              <input
                type="text"
                value={potentialCategory}
                onChange={(e) => setPotentialCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title:</label>
              <input
                type="text"
                value={potentialTitle}
                onChange={(e) => setPotentialTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description:</label>
              <textarea
                value={potentialDescription}
                onChange={(e) => setPotentialDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded h-32"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={!selectedPhase || !potentialCategory || !potentialTitle || !potentialDescription}
            >
              Add AI Potential
            </button>

            {potentials.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Existing Potentials:</h3>
                <div className="space-y-2">
                  {potentials.map((potential) => (
                    <div key={potential.id} className="p-3 bg-gray-50 rounded">
                      <div className="font-bold">{potential.title}</div>
                      <div className="text-sm text-gray-600">{potential.category}</div>
                      <div className="text-sm mt-1">{potential.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={handleNewPhaseSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phase No:</label>
              <input
                type="text"
                value={newPhaseNo}
                onChange={(e) => setNewPhaseNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Profile Info:</label>
              <textarea
                value={newProfileInfo}
                onChange={(e) => setNewProfileInfo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded h-32"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={!newPhaseNo || !newTitle || !newProfileInfo}
            >
              Create New Phase
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
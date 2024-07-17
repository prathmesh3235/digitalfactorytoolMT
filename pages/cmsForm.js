import React, { useState } from 'react';
import phaseContent from "../src/app/phaseContent.json";
import { createPhase } from "../utils/phases";

const PhaseForm = () => {
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedSubProperty, setSelectedSubProperty] = useState('');
  const [phaseNo, setPhaseNo] = useState('');
  const [title, setTitle] = useState('');
  const [profileInfo, setProfileInfo] = useState('');
  const [showForm, setShowForm] = useState(false);

  const phases = Object.keys(phaseContent);
  const properties = selectedPhase ? Object.keys(phaseContent[selectedPhase]) : [];
  const profileProperties = selectedPhase ? Object.keys(phaseContent[selectedPhase].profile) : [];

  const handlePhaseChange = (e) => {
    setSelectedPhase(e.target.value);
    setSelectedProperty('');
    setSelectedSubProperty('');
  };

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
    setSelectedSubProperty('');
  };

  const handleSubPropertyChange = (e) => {
    setSelectedSubProperty(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      phaseNo,
      title,
      profile_info: profileInfo,
    };
    try {
      const response = await createPhase(payload);
      console.log('Phase created successfully:', response);
      // Reset form fields or add any other UI updates
      setPhaseNo('');
      setTitle('');
      setProfileInfo('');
    } catch (error) {
      console.error('Failed to create phase:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {showForm ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="phaseNo" className="block text-gray-700 font-bold mb-2">Phase No:</label>
              <input
                type="text"
                id="phaseNo"
                value={phaseNo}
                onChange={(e) => setPhaseNo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="profileInfo" className="block text-gray-700 font-bold mb-2">Profile Info:</label>
              <input
                type="text"
                id="profileInfo"
                value={profileInfo}
                onChange={(e) => setProfileInfo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              disabled={!phaseNo || !title || !profileInfo}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="flex justify-between mt-4">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mr-2"
                onClick={() => setShowForm(true)}
              >
                Add New Phase
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-full ml-2">
                Add Profile Data
              </button>
            </div>
            <form>
              <div className="mb-4">
                <label htmlFor="phase" className="block text-gray-700 font-bold mb-2">Phase:</label>
                <select
                  id="phase"
                  value={selectedPhase}
                  onChange={handlePhaseChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Select a phase</option>
                  {phases.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="property" className="block text-gray-700 font-bold mb-2">Property:</label>
                <select
                  id="property"
                  value={selectedProperty}
                  onChange={handlePropertyChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={!selectedPhase}
                >
                  <option value="" disabled>Select a property</option>
                  {properties.map(property => (
                    <option key={property} value={property}>{property}</option>
                  ))}
                </select>
              </div>
              {selectedProperty === 'profile' && (
                <div className="mb-4">
                  <label htmlFor="subProperty" className="block text-gray-700 font-bold mb-2">Sub Property:</label>
                  <select
                    id="subProperty"
                    value={selectedSubProperty}
                    onChange={handleSubPropertyChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="" disabled>Select a sub property</option>
                    {profileProperties.map(subProperty => (
                      <option key={subProperty} value={subProperty}>{subProperty}</option>
                    ))}
                  </select>
                </div>
              )}
              {selectedProperty === 'ai-potential' && (
                <div className="mb-4">
                  <label htmlFor="aiText" className="block text-gray-700 font-bold mb-2">AI Potential Information:</label>
                  <input
                    type="text"
                    id="aiText"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              )}
              {selectedSubProperty && (
                <div className="mb-4">
                  <label htmlFor="subPropertyText" className="block text-gray-700 font-bold mb-2">{selectedSubProperty}:</label>
                  <input
                    type="text"
                    id="subPropertyText"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                disabled={!selectedPhase || !selectedProperty || (selectedProperty === 'profile' && !selectedSubProperty)}
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PhaseForm;

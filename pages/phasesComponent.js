import React, { useState, useEffect } from 'react';
import "../src/app/globals.css";
import phaseContent from "../src/app/phaseContent.json";
import { update } from "../utils/phases.js";
import { getPhases } from "../utils/phases.js";

export default function PhasesComponent() {
  const [phases, setPhases] = useState([]);
  const [activePhase, setActivePhase] = useState(null);
  const [profileContent, setProfileContent] = useState({});
  const [aiPotentialContent, setAiPotentialContent] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch phases data from backend
    const fetchPhases = async () => {
      try {
        const phasesData = await getPhases();
        const formattedPhases = phasesData.map(phase => ({
          id: phase.id,
          name: `Phase ${phase.phaseNo}`,
          description: phase.title
        }));
        setPhases(formattedPhases);
        setActivePhase(formattedPhases[0]);
      } catch (error) {
        console.error("Failed to fetch phases", error);
      }
    };

    fetchPhases();

    // Check if the user is logged in
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (activePhase) {
      setProfileContent(phaseContent[activePhase.name]['profile']);
      setAiPotentialContent(phaseContent[activePhase.name]['ai-potential']);
    }
  }, [activePhase]);

  const handlePhaseClick = (phase) => {
    setActivePhase(phase);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handlePhaseChange = (index, key, value) => {
    const newPhases = [...phases];
    newPhases[index][key] = value;
    setPhases(newPhases);
    setActivePhase(newPhases[index]);
  };

  const handleKeyPress = async (event, index, key) => {
    if (event.key === 'Enter') {
      setLoading(true);
      const phase = phases[index];
      try {
        await update(phase.id, { title: phase.description });
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000); // Hide success message after 2 seconds
        }, 1000); // Show loading for 2 seconds
      } catch (error) {
        setLoading(false);
        console.error("Failed to update phase title", error);
      }
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center p-4">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-2xl z-50">
            Loading...
          </div>
        )}
        {success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-green-500 text-white text-center py-2 px-4 rounded shadow-lg">
              Updated Successfully
            </div>
          </div>
        )}
        <div className="justify-center mb-4 mt-4 md:mt-12">
          {isLoggedIn && (
            !isEditing ? (
              <button
                onClick={handleEditClick}
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-200"
              >
                Edit Information
              </button>
            ) : (
              <button
                onClick={handleSaveClick}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
              >
                Save Information
              </button>
            )
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="bg-blue-800 text-white p-4 rounded">Factory Planning</div>
          <div className="bg-blue-800 text-white p-4 rounded">AI Potentials in Factory Planning</div>
          <div className="bg-blue-800 text-white p-4 rounded">Digitalisation Potentials in Factory Planning</div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 mb-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`relative text-white p-4 flex items-center justify-center cursor-pointer ${
                  activePhase && activePhase.id === phase.id ? 'bg-orange-500' : 'bg-green-500'
                }`}
                onClick={() => handlePhaseClick(phase)}
                style={{ 
                  clipPath: 'polygon(10% 0%, 100% 0%, 90% 50%, 100% 100%, 10% 100%, 0% 50%)', 
                  padding: '1rem 2rem',
                  transition: 'background-color 0.3s'
                }}
              >
                <div className="text-center">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={phase.name}
                        onChange={(e) => handlePhaseChange(index, 'name', e.target.value)}
                        className="bg-transparent border-none text-white text-center"
                        onKeyPress={(e) => handleKeyPress(e, index, 'name')}
                      />
                      <input
                        type="text"
                        value={phase.description}
                        onChange={(e) => handlePhaseChange(index, 'description', e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, index, 'description')}
                        className="bg-transparent border-none text-white text-center text-sm"
                      />
                    </>
                  ) : (
                    <>
                      <div>{phase.name}</div>
                      <div className="text-sm">{phase.description}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {activePhase && (
          <div className="flex flex-col mt-4 w-full p-3">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <div className="flex-1">
                <div className="p-4 bg-orange-500 text-white rounded-lg text-center mb-2">Profile</div>
                <div className="p-4 bg-gray-100 text-black rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(profileContent).map((key, index) => (
                    <div key={index}>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> 
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileContent[key]}
                          onChange={(e) => setProfileContent({ ...profileContent, [key]: e.target.value })}
                          onKeyPress={(e) => handleKeyPress(e, index, key)}
                          className="bg-transparent border-none w-full"
                        />
                      ) : (
                        profileContent[key]
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="p-4 bg-green-500 text-white rounded-lg text-center mb-2">AI Potential</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiPotentialContent.map((potential, index) => (
                    <div key={index} className="p-4 bg-white text-black rounded-lg shadow-lg border border-gray-300">
                      {isEditing ? (
                        <input
                          type="text"
                          value={potential}
                          onChange={(e) => {
                            const newAiPotentialContent = [...aiPotentialContent];
                            newAiPotentialContent[index] = e.target.value;
                            setAiPotentialContent(newAiPotentialContent);
                          }}
                          onKeyPress={(e) => handleKeyPress(e, index, index)}
                          className="bg-transparent border-none w-full"
                        />
                      ) : (
                        potential
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

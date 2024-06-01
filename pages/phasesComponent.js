import React, { useState, useEffect } from 'react';
import "../src/app/globals.css";
import phaseContent from "../src/app/phaseContent.json";

export default function PhasesComponent() {
  const phases = [
    { name: 'Phase 1', description: 'Setting of objectives' },
    { name: 'Phase 2', description: 'Establishment of the product basis' },
    { name: 'Phase 3', description: 'Concept planning' },
    { name: 'Phase 4', description: 'Detailed planning' },
    { name: 'Phase 5', description: 'Preparation for realization' },
    { name: 'Phase 6', description: 'Monitoring of realization' },
    { name: 'Phase 7', description: 'Ramp-up support' },
  ];
  
  const [activePhase, setActivePhase] = useState('Phase 1');
  const [profileContent, setProfileContent] = useState('');
  const [aiPotentialContent, setAiPotentialContent] = useState('');

  useEffect(() => {
    setProfileContent(phaseContent[activePhase]['profile']);
    setAiPotentialContent(phaseContent[activePhase]['ai-potential']);
  }, [activePhase]);

  const handlePhaseClick = (phase) => {
    setActivePhase(phase);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center space-x-4 mb-4">
        <div className="bg-blue-800 text-white p-4 rounded">Factory Planning</div>
        <div className="bg-blue-800 text-white p-4 rounded">AI Potentials in Factory Planning</div>
        <div className="bg-blue-800 text-white p-4 rounded">Digitalisation Potentials in Factory Planning</div>
      </div>
      <div className="flex space-x-4 p-2 w-full">
        {phases.map((phase, index) => (
          <div
            key={index}
            className={`relative text-white p-4 flex items-center justify-center cursor-pointer ${
              activePhase === phase.name ? 'bg-orange-500' : 'bg-green-500'
            }`}
            onClick={() => handlePhaseClick(phase.name)}
            style={{ 
              clipPath: 'polygon(10% 0%, 100% 0%, 90% 50%, 100% 100%, 10% 100%, 0% 50%)', 
              padding: '1rem 2rem',
              transition: 'background-color 0.3s'
            }}
          >
            <div className="text-center">
              <div>{phase.name}</div>
              <div className="text-sm">{phase.description}</div>
            </div>
          </div>
        ))}
      </div>
      {activePhase && (
        <div className="flex flex-col mt-4 w-full p-3">
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <div className="p-4 bg-orange-500 text-white rounded-lg text-center mb-2">Profile</div>
              <div className="p-4 bg-gray-100 text-black rounded-lg shadow-lg">
                {profileContent}
              </div>
            </div>
            <div className="flex-1">
              <div className="p-4 bg-green-500 text-white rounded-lg text-center mb-2">AI Potential</div>
              <div className="p-4 bg-gray-100 text-black rounded-lg shadow-lg">
                {aiPotentialContent}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
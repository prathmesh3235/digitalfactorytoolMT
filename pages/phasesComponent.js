import React, { useState } from 'react';
import "../src/app/globals.css";

export default function PhasesComponent() {
  const phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'];
  const [activePhase, setActivePhase] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const handlePhaseClick = (phase) => {
    setActivePhase(phase);
    setActiveTab('profile');  // Reset tab to profile when phase changes
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center space-x-4 mb-4">
        <div className="bg-blue-800 text-white p-4 rounded">Factory Planning</div>
        <div className="bg-blue-800 text-white p-4 rounded">AI Potentials in Factory Planning</div>
        <div className="bg-blue-800 text-white p-4 rounded">Digitalisation Potentials in Factory Planning</div>
      </div>
      <div className="flex space-x-4">
        {phases.map((phase, index) => (
          <div
            key={index}
            className={`bg-green-500 text-white p-4 rounded flex items-center justify-center cursor-pointer ${
              activePhase === phase ? 'bg-orange-500' : 'bg-green-500'
            }`}
            onClick={() => handlePhaseClick(phase)}
          >
            {phase}
          </div>
        ))}
      </div>
      {activePhase && (
        <div className="flex space-x-4 mt-4">
          <div
            className={`p-4 rounded cursor-pointer ${
              activeTab === 'profile' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
            }`}
            onClick={() => handleTabClick('profile')}
          >
            Profile
          </div>
          <div
            className={`p-4 rounded cursor-pointer ${
              activeTab === 'ai-potential' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
            }`}
            onClick={() => handleTabClick('ai-potential')}
          >
            AI Potential
          </div>
        </div>
      )}
    </div>
  );
}

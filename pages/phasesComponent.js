import React, { useState, useEffect } from "react";
import "../src/app/globals.css";
import { update } from "../utils/phases.js";
import { getPhases } from "../utils/phases.js";
import Link from "next/link";
import AIPotentialsSection from "./AIPotentialsSection";
import PhaseProfile from "./profiletab";
import InterfaceMatrix from "./interfaceMatrix";

export default function PhasesComponent() {
  // Existing states
  const [phases, setPhases] = useState([]);
  const [activePhase, setActivePhase] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // New state for active tab
  const [activeTab, setActiveTab] = useState('factory');

  // Existing functions remain the same...
  const formatPhaseDescription = (text) => {
    const words = text.split(" ");
    if (words.length <= 2) return text;
    const midPoint = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, midPoint).join(" ");
    const secondLine = words.slice(midPoint).join(" ");
    return [firstLine, secondLine];
  };

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const phasesData = await getPhases();
        const formattedPhases = phasesData.map((phase) => ({
          id: phase.id,
          name: `Phase ${phase.phaseNo}`,
          description: phase.title,
          phaseNo: phase.phaseNo,
        }));
        setPhases(formattedPhases);
        setActivePhase(formattedPhases[0]);
      } catch (error) {
        console.error("Failed to fetch phases", error);
      }
    };

    fetchPhases();
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handlePhaseClick = (phase) => {
    setActivePhase(phase);
  };

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => setIsEditing(false);
  const handlePhaseChange = (index, key, value) => {
    const newPhases = [...phases];
    newPhases[index][key] = value;
    setPhases(newPhases);
    setActivePhase(newPhases[index]);
  };

  const handleKeyPress = async (event, index) => {
    if (event.key === "Enter") {
      setLoading(true);
      const phase = phases[index];
      try {
        await update(phase.id, {
          title: phase.description,
          phaseNo: phase.phaseNo,
        });
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        }, 1000);
      } catch (error) {
        setLoading(false);
        console.error("Failed to update phase", error);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'ai':
        return (
          <>
            {/* Show phases chevron in AI tab too */}
            <div className="w-full overflow-x-auto mb-6 pb-2">
              <div className="flex min-w-max px-4">
                {phases.map((phase, index) => {
                  const description = formatPhaseDescription(phase.description);
                  const isMultiline = Array.isArray(description);
  
                  return (
                    <button
                      key={index}
                      onClick={() => handlePhaseClick(phase)}
                      className={`relative h-[70px] min-w-[180px] flex items-center justify-center 
                        ${activePhase && activePhase.id === phase.id 
                          ? "bg-[#00AB8E] text-white" 
                          : "bg-[#e0e0e0] text-gray-700 hover:bg-[#00AB8E] hover:text-white"
                        } transition-colors duration-200 mx-2 first:ml-0 last:mr-0`}
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                        filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
                      }}
                    >
                      {/* Phase button content remains the same */}
                      <div className="text-center px-3 flex flex-col items-center justify-center w-full py-2">
                        <div className="font-medium text-sm mb-1">{phase.name}</div>
                        {isMultiline ? (
                          <>
                            <div className="text-xs leading-tight">{description[0]}</div>
                            <div className="text-xs leading-tight">{description[1]}</div>
                          </>
                        ) : (
                          <div className="text-xs">{description}</div>
                        )}
                      </div>
                      {index < phases.length - 1 && (
                        <div
                          className="absolute right-[-30px] w-[20px] h-[2px] bg-gray-300 top-1/2 transform -translate-y-1/2 z-10"
                          style={{ right: "-25px" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* AI Potentials content */}
            <div className="w-full">
              <AIPotentialsSection
                phaseId={activePhase?.id}
                isEditing={isEditing}
                token={sessionStorage.getItem("token")}
                fullWidth={true}
              />
            </div>
          </>
        );
      case 'matrix':
        return <InterfaceMatrix activePhase={activePhase} phases={phases} />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <PhaseProfile phaseId={activePhase?.id} isEditing={isEditing} />
            <div className="grid grid-cols-1 gap-6 w-full">
              <AIPotentialsSection
                phaseId={activePhase?.id}
                isEditing={isEditing}
                token={sessionStorage.getItem("token")}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center p-4 max-w-[1400px] mx-auto">
      {/* Loading and Success Overlays */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-2xl z-50">
          Loading...
        </div>
      )}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#10B981] text-white text-center py-2 px-4 rounded shadow-lg">
            Updated Successfully
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 my-4 w-full">
        {isLoggedIn && (
          !isEditing ? (
            <>
              <button
                onClick={handleEditClick}
                className="bg-[#00AB8E] text-white px-4 py-2 rounded hover:bg-[#009579] transition-all"
              >
                Edit Information
              </button>
              <Link href="/cmsForm">
                <button className="bg-[#B5BD00] text-white px-4 py-2 rounded hover:brightness-95 transition-all">
                  Add Information
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={handleSaveClick}
              className="bg-[#00AB8E] text-white px-4 py-2 rounded hover:bg-[#009579] transition-all"
            >
              Save Information
            </button>
          )
        )}
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full mb-4">
        {[
          { id: 'factory', label: 'Factory Planning' },
          { id: 'ai', label: 'AI Potentials in Factory Planning' },
          { id: 'matrix', label: 'Interface Matrix' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-3 rounded text-center font-medium transition-colors duration-200
              ${activeTab === tab.id 
                ? 'bg-[#00AB8E] text-white' 
                : 'bg-[#e0e0e0] text-gray-700 hover:bg-[#00AB8E] hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Phase Chevrons - Only show in factory tab */}
      {activeTab === 'factory' && (
        <div className="w-full overflow-x-auto mb-6 pb-2">
          <div className="flex min-w-max px-4">
            {phases.map((phase, index) => {
              const description = formatPhaseDescription(phase.description);
              const isMultiline = Array.isArray(description);

              return (
                <button
                  key={index}
                  onClick={() => handlePhaseClick(phase)}
                  className={`relative h-[70px] min-w-[180px] flex items-center justify-center 
                    ${activePhase && activePhase.id === phase.id 
                      ? "bg-[#00AB8E] text-white" 
                      : "bg-[#e0e0e0] text-gray-700 hover:bg-[#00AB8E] hover:text-white"
                    } transition-colors duration-200 mx-2 first:ml-0 last:mr-0`}
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
                  }}
                >
                  <div className="text-center px-3 flex flex-col items-center justify-center w-full py-2">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={phase.name}
                          onChange={(e) => handlePhaseChange(index, "name", e.target.value)}
                          className="bg-transparent border-none text-inherit text-center w-full text-sm font-medium"
                          onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                        <input
                          type="text"
                          value={phase.description}
                          onChange={(e) => handlePhaseChange(index, "description", e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                          className="bg-transparent border-none text-inherit text-center text-xs w-full mt-1"
                        />
                      </>
                    ) : (
                      <>
                        <div className="font-medium text-sm mb-1">{phase.name}</div>
                        {isMultiline ? (
                          <>
                            <div className="text-xs leading-tight">{description[0]}</div>
                            <div className="text-xs leading-tight">{description[1]}</div>
                          </>
                        ) : (
                          <div className="text-xs">{description}</div>
                        )}
                      </>
                    )}
                  </div>
                  {index < phases.length - 1 && (
                    <div
                      className="absolute right-[-30px] w-[20px] h-[2px] bg-gray-300 top-1/2 transform -translate-y-1/2 z-10"
                      style={{ right: "-25px" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Content Area */}
      {activePhase && renderContent()}
    </div>
  );
}
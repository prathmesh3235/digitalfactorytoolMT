import { useState } from "react";
import phaseContent from "../src/app/phaseContent.json";

const PhaseForm = () => {
    const [selectedPhase, setSelectedPhase] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedSubProperty, setSelectedSubProperty] = useState('');

  
    const phases = Object.keys(phaseContent);
    const properties = selectedPhase ? Object.keys(phaseContent[selectedPhase]) : [];
    const subproperties = selectedPhase ? Object.keys(phaseContent[selectedPhase].properties) : []; 
  
    const handlePhaseChange = (e) => {
      setSelectedPhase(e.target.value);
      setSelectedProperty(''); // Reset property when phase changes
      setSelectedSubProperty('');
    };
  
    const handlePropertyChange = (e) => {
      setSelectedProperty(e.target.value);
      setSelectedSubProperty('');
    };

    const handleSubPropertyChange = (e) => {
        setSelectedSubProperty(e.target.value);
      };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Selected Phase:', selectedPhase);
      console.log('Selected Property:', selectedProperty);
    };
  
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <form onSubmit={handleSubmit}>
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
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                disabled={!selectedPhase || !selectedProperty}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      );
    };
  
  export default PhaseForm;
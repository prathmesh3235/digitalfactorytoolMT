import { useState } from "react";
import phaseContent from "../src/app/phaseContent.json";

const PhaseForm = () => {
    const [selectedPhase, setSelectedPhase] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
  
    const phases = Object.keys(phaseContent);
    const properties = selectedPhase ? Object.keys(phaseContent[selectedPhase]) : [];
  
    const handlePhaseChange = (e) => {
      setSelectedPhase(e.target.value);
      setSelectedProperty(''); // Reset property when phase changes
    };
  
    const handlePropertyChange = (e) => {
      setSelectedProperty(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Selected Phase:', selectedPhase);
      console.log('Selected Property:', selectedProperty);
    };
  
    return (
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={!selectedPhase || !selectedProperty}
        >
          Submit
        </button>
      </form>
    );
  };
  
  export default PhaseForm;
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "./Navbar";

const Notification = ({ type, message, onClose }) => (
  <div
    className={`mb-4 p-4 rounded ${
      type === "success"
        ? "bg-green-100 text-[#009374]"
        : "bg-red-100 text-red-800"
    }`}
  >
    <div className="flex justify-between items-center">
      <p>{message}</p>
      <button onClick={onClose} className="text-sm">
        &times;
      </button>
    </div>
  </div>
);

export default function PhaseForm() {
  const [selectedPhase, setSelectedPhase] = useState("");
  const [phaseNo, setPhaseNo] = useState("");
  const [title, setTitle] = useState("");
  const [profileInfo, setProfileInfo] = useState("");
  const [activeTab, setActiveTab] = useState("phase");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [phases, setPhases] = useState([]);
  const [potentialCategory, setPotentialCategory] = useState("");
  const [potentialTitle, setPotentialTitle] = useState("");
  const [potentialDescription, setPotentialDescription] = useState("");
  const [potentials, setPotentials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedSubProperty, setSelectedSubProperty] = useState("");
  const [profileProperties, setProfileProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [newPhaseNo, setNewPhaseNo] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newProfileInfo, setNewProfileInfo] = useState("");

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const response = await axiosInstance.get("/phases");
        setPhases(response.data);
      } catch (error) {
        console.error("Failed to fetch phases:", error);
      }
    };
    fetchPhases();
  }, []);

  useEffect(() => {
    const fetchPotentials = async () => {
      if (selectedPhase) {
        try {
          const response = await axiosInstance.get(
            `/potential/${selectedPhase}`
          );
          setPotentials(response.data);
        } catch (error) {
          console.error("Failed to fetch potentials:", error);
        }
      }
    };
    fetchPotentials();
  }, [selectedPhase]);

  const handlePhaseChange = (e) => {
    setSelectedPhase(e.target.value);
    setSelectedProperty("");
    setSelectedSubProperty("");
  };

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
    setSelectedSubProperty("");
  };

  const handleSubPropertyChange = (e) => {
    setSelectedSubProperty(e.target.value);
  };

  const handlePhaseFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      phaseNo,
      title,
      profile_info: profileInfo,
    };
    try {
      const response = await axiosInstance.post("/phases", payload);
      setNotification({
        show: true,
        message: "Phase created successfully!",
        type: "success",
      });
      setPhaseNo("");
      setTitle("");
      setProfileInfo("");
      setShowForm(false);

      const updatedPhases = await axiosInstance.get("/phases");
      setPhases(updatedPhases.data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to create phase",
        type: "error",
      });
    }
  };

  const handlePhaseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      phaseNo,
      title,
      profile_info: profileInfo,
    };
    try {
      const response = await axiosInstance.post("/phases", payload);
      setNotification({
        show: true,
        message: "Phase created successfully!",
        type: "success",
      });
      setPhaseNo("");
      setTitle("");
      setProfileInfo("");

      const updatedPhases = await axiosInstance.get("/phases");
      setPhases(updatedPhases.data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to create phase",
        type: "error",
      });
    }
  };

  const handleAIPotentialSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPhase) {
      setNotification({
        show: true,
        message: "Please select a phase",
        type: "error",
      });
      return;
    }

    try {
      const payload = {
        phaseId: selectedPhase,
        category: potentialCategory,
        title: potentialTitle,
        description: potentialDescription,
      };

      const response = await axiosInstance.post("/potential", payload);

      if (response.status === 201) {
        setNotification({
          show: true,
          message: "AI Potential added successfully!",
          type: "success",
        });
        setPotentialCategory("");
        setPotentialTitle("");
        setPotentialDescription("");

        const updatedPotentials = await axiosInstance.get(
          `/potential/${selectedPhase}`
        );
        setPotentials(updatedPotentials.data);
      }
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to add AI Potential",
        type: "error",
      });
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
      const response = await axiosInstance.post("/phases", payload);
      setNotification({
        show: true,
        message: "Phase created successfully!",
        type: "success",
      });
      setNewPhaseNo("");
      setNewTitle("");
      setNewProfileInfo("");

      const updatedPhases = await axiosInstance.get("/phases");
      setPhases(updatedPhases.data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to create phase",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center py-8 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          {notification.show && (
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification({ ...notification, show: false })}
            />
          )}

          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 px-4 transition-colors duration-200 ${
                activeTab === "phase"
                  ? "bg-[#009374] text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("phase")}
            >
              Phase Information
            </button>
            <button
              className={`flex-1 py-2 px-4 transition-colors duration-200 ${
                activeTab === "aiPotential"
                  ? "bg-[#009374] text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("aiPotential")}
            >
              AI Potential
            </button>
            <button
              className={`flex-1 py-2 px-4 transition-colors duration-200 ${
                activeTab === "phases"
                  ? "bg-[#009374] text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("phases")}
            >
              Phases
            </button>
          </div>

          {activeTab === "phases" ? (
            <form onSubmit={handlePhaseFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="phaseNo"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Phase No:
                </label>
                <input
                  type="text"
                  id="phaseNo"
                  value={phaseNo}
                  onChange={(e) => setPhaseNo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009374] focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009374] focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="profileInfo"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Profile Info:
                </label>
                <input
                  type="text"
                  id="profileInfo"
                  value={profileInfo}
                  onChange={(e) => setProfileInfo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009374] focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-[#009374] hover:bg-[#007a60] text-white font-bold py-2 px-4 rounded w-full transition-colors duration-200 disabled:opacity-50"
                disabled={!phaseNo || !title || !profileInfo}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-[#8a8a8a] hover:bg-[#707070] text-white font-bold py-2 px-4 rounded w-full mt-4 transition-colors duration-200"
              >
                Cancel
              </button>
            </form>
          ) : activeTab === "aiPotential" ? (
            <form onSubmit={handleAIPotentialSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Select Phase:
                </label>
                <select
                  value={selectedPhase}
                  onChange={handlePhaseChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009374] focus:border-transparent"
                >
                  <option value="">Select a phase</option>
                  {phases.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      Phase {phase.phaseNo} - {phase.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Category:
                </label>
                <input
                  type="text"
                  value={potentialCategory}
                  onChange={(e) => setPotentialCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009374] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Title:
                </label>
                <input
                  type="text"
                  value={potentialTitle}
                  onChange={(e) => setPotentialTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009374] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Description:
                </label>
                <textarea
                  value={potentialDescription}
                  onChange={(e) => setPotentialDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-[#009374] focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#009374] hover:bg-[#007a60] text-white font-bold py-2 rounded transition-colors duration-200 disabled:opacity-50"
                disabled={
                  !selectedPhase ||
                  !potentialCategory ||
                  !potentialTitle ||
                  !potentialDescription
                }
              >
                Add AI Potential
              </button>

              {potentials.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2 text-[#009374]">
                    Existing Potentials:
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                    {potentials.map((potential) => (
                      <div
                        key={potential.id}
                        className="p-3 bg-gray-50 rounded shadow-sm border border-gray-200"
                      >
                        <div className="font-bold text-[#009374]">
                          {potential.title}
                        </div>
                        <div className="text-sm text-[#8a8a8a]">
                          {potential.category}
                        </div>
                        <div className="text-sm mt-1">
                          {potential.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleNewPhaseSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Phase No:
                </label>
                <input
                  type="text"
                  value={newPhaseNo}
                  onChange={(e) => setNewPhaseNo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009374] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Title:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#009374] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Profile Info:
                </label>
                <textarea
                  value={newProfileInfo}
                  onChange={(e) => setNewProfileInfo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-[#009374] focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#009374] hover:bg-[#007a60] text-white font-bold py-2 rounded transition-colors duration-200 disabled:opacity-50"
                disabled={!newPhaseNo || !newTitle || !newProfileInfo}
              >
                Create New Phase
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

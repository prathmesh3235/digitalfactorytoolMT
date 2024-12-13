import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

// A simple star display for read-only ratings
const DisplayStars = ({ rating }) => {
  const maxStars = 5;
  return (
    <div className="flex gap-1">
      {[...Array(maxStars)].map((_, i) => {
        const starIndex = i + 1;
        return (
          <span
            key={starIndex}
            className={`text-xl ${
              starIndex <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const TopRatedPotentials = ({ onClose }) => {
  const [potentials, setPotentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTopRatedPotentials();
  }, []);

  const fetchTopRatedPotentials = async () => {
    try {
      // This endpoint should now include a JOIN with phases so we get phaseNo and phaseTitle
      const response = await axios.get("/potential/top-rated/all");
      setPotentials(response.data);
    } catch (err) {
      console.error("Error fetching top-rated potentials:", err);
      setError("Failed to fetch top-rated potentials.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00AB8E] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  // Sort by rating descending, placing null ratings last
  const sortedPotentials = [...potentials].sort((a, b) => {
    if (b.rating === null && a.rating === null) return 0;
    if (b.rating === null) return -1;
    if (a.rating === null) return 1;
    return b.rating - a.rating;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-xl w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-[#00AB8E] mb-4 text-center sm:text-left">
          Top Rated AI Potentials
        </h2>

        {/* Scrollable container for the list */}
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          {sortedPotentials.length === 0 ? (
            <p className="text-gray-600">No ratings yet.</p>
          ) : (
            <ul className="space-y-4">
              {sortedPotentials.map((pot, index) => (
                <li
                  key={pot.id || index}
                  className="bg-gray-50 p-4 rounded shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Text content */}
                    <div className="md:w-3/4">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {pot.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {pot.description}
                      </p>
                      {/* Phase info */}
                      {(pot.phaseNo || pot.phaseTitle) && (
                        <p className="text-xs text-gray-500 mt-2">
                          {pot.phaseNo
                            ? `Phase ${pot.phaseNo}${pot.phaseTitle ? ': ' + pot.phaseTitle : ''}`
                            : `Phase ID: ${pot.phaseId}`}
                        </p>
                      )}
                      {/* Category chip */}
                      {pot.category && (
                        <p className="mt-2 inline-block bg-teal-50 text-teal-600 text-xs px-2 py-1 rounded">
                          {pot.category}
                        </p>
                      )}
                    </div>

                    {/* Rating display */}
                    <div className="mt-2 md:mt-0 md:w-1/4 flex items-center justify-end">
                      <DisplayStars rating={pot.rating || 0} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopRatedPotentials;

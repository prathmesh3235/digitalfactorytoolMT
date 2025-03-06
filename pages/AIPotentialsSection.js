import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const StarRating = ({ rating, onRate, disabled }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && onRate(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          disabled={disabled}
          className={`text-xl transition-colors ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          } ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const DisplayStars = ({ rating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-xl ${
          star <= rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ))}
  </div>
);

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md m-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const AIPotentialsSection = ({ phaseId, isEditing }) => {
  const [potentials, setPotentials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPotential, setEditingPotential] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    fetchPotentials();
  }, [phaseId]);

  const checkAuthStatus = () => {
    const adminStatus = sessionStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  };

  const fetchPotentials = async () => {
    try {
      const response = await axios.get(`/potential/${phaseId}`);
      setPotentials(response.data);
    } catch (error) {
      showNotification("Failed to load potentials", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !isEditing) return;

    const formData = {
      title: e.target.title.value,
      category: e.target.category.value,
      description: e.target.description.value,
      phaseId,
    };

    try {
      if (editingPotential?.id) {
        await axios.patch(`/potential/${editingPotential.id}`, formData);
      } else {
        await axios.post("/potential", formData);
      }
      await fetchPotentials();
      setIsModalOpen(false);
      setEditingPotential(null);
      showNotification(
        editingPotential ? "Updated successfully" : "Added successfully"
      );
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to save changes",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !isAdmin ||
      !isEditing ||
      !window.confirm("Are you sure you want to delete this potential?")
    )
      return;

    try {
      await axios.delete(`/potential/${id}`);
      await fetchPotentials();
      showNotification("Deleted successfully");
    } catch (error) {
      showNotification("Failed to delete", "error");
    }
  };

  const handleRatingChange = async (potentialId, newRating) => {
    if (!isAdmin || !isEditing) return;

    try {
      await axios.patch(`/potential/${potentialId}/rating`, {
        rating: newRating,
      });
      await fetchPotentials();
      showNotification("Rating updated successfully");
    } catch (error) {
      showNotification("Failed to update rating", "error");
    }
  };

  const PotentialCard = ({ potential }) => (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-teal-500 hover:shadow-lg transition-all duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">{potential.title}</h3>
              <span className="text-sm text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                {potential.category}
              </span>
            </div>
            <p className="text-gray-600">{potential.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              {isAdmin && isEditing ? (
                <StarRating
                  rating={potential.rating}
                  onRate={(rating) => handleRatingChange(potential.id, rating)}
                  disabled={!isEditing}
                />
              ) : (
                <DisplayStars rating={potential.rating} />
              )}
            </div>
          </div>
          {isAdmin && isEditing && (
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => {
                  setEditingPotential(potential);
                  setIsModalOpen(true);
                }}
                className="p-2 hover:bg-gray-100 rounded-full text-teal-600"
                title="Edit"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(potential.id)}
                className="p-2 hover:bg-gray-100 rounded-full text-red-500"
                title="Delete"
              >
                <DeleteIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {notification && (
        <div
          className={`
          fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300
          ${
            notification.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }
        `}
        >
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
        <h2 className="text-3xl font-bold text-[#00AB8E]">AI Potentials For Phase {phaseId}</h2>
          {/* <p className="text-gray-600">
            Advanced AI capabilities for optimizing factory planning
          </p> */}
        </div>
        {isAdmin && isEditing && (
          <button
            onClick={() => {
              setEditingPotential(null);
              setIsModalOpen(true);
            }}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 
              transition-colors flex items-center gap-2"
          >
            Add Potential
          </button>
        )}
      </div>

      <div className="space-y-4">
        {potentials.map((potential) => (
          <PotentialCard key={potential.id} potential={potential} />
        ))}
      </div>

      {isAdmin && isEditing && isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingPotential ? "Edit Potential" : "Add New Potential"}
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                defaultValue={editingPotential?.category}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 
                  focus:border-teal-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={editingPotential?.title}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 
                  focus:border-teal-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={editingPotential?.description}
                className="w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-teal-500 
                  focus:border-teal-500 outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 
                  transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AIPotentialsSection;

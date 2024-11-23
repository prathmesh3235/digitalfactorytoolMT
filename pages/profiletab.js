import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Cloud,
  FileText,
  Lightbulb,
  Link2,
  Target,
  Wrench,
  Users,
} from "lucide-react";
import axios from "../utils/axiosInstance";
import SuccessDialog from "./SuccessDialog";

const iconMap = {
  FileText: FileText,
  Users: Users,
  Cloud: Cloud,
  Wrench: Wrench,
  Link2: Link2,
  AlertTriangle: AlertTriangle,
  Target: Target,
  Lightbulb: Lightbulb,
};

const ProfileBlock = ({
  icon,
  title,
  content,
  reference,
  isEditing,
  onUpdate,
  sectionId,
}) => {
  const IconComponent = iconMap[icon] || FileText;
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [editedReference, setEditedReference] = useState(reference);

  useEffect(() => {
    setEditedTitle(title);
    setEditedContent(content);
    setEditedReference(reference);
  }, [title, content, reference]);

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      await onUpdate(sectionId, {
        section_title: editedTitle,
        content: editedContent,
        reference_text: editedReference,
      });
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-start space-x-4">
        {/* Icon Block */}
        <div className="bg-[#00AB8E] bg-opacity-10 p-3 rounded-lg">
          <IconComponent className="text-[#00AB8E] w-6 h-6" />
        </div>

        {/* Content Block */}
        <div className="flex-1">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full mb-2 p-2 text-lg font-semibold border rounded focus:ring-2 focus:ring-[#00AB8E] focus:outline-none"
              />
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-2 text-gray-600 border rounded focus:ring-2 focus:ring-[#00AB8E] focus:outline-none"
                rows={3}
              />
              {reference !== null && (
                <input
                  type="text"
                  value={editedReference || ""}
                  onChange={(e) => setEditedReference(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full mt-2 p-2 text-sm text-gray-400 border rounded focus:ring-2 focus:ring-[#00AB8E] focus:outline-none"
                  placeholder="Reference (optional)"
                />
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {title}
              </h3>
              <p className="text-gray-600">{content}</p>
              {reference && (
                <p className="text-sm text-gray-400 mt-2 italic">{reference}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Connector Line */}
      <div className="absolute -right-4 top-1/2 w-4 h-[2px] bg-[#00AB8E] transform -translate-y-1/2" />
    </div>
  );
};

const PhaseProfile = ({ phaseId, isEditing }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/profile/${phaseId}`);
      setProfileData({
        phaseDetails: {
          title: `Phase ${phaseId}: ${
            response.data?.sections[0]?.section_title || "Detailed Planning"
          }`,
        },
        sections: response.data?.sections || [],
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phaseId) {
      fetchProfile();
    }
  }, [phaseId]);

  const handleSectionUpdate = async (sectionId, updateData) => {
    try {
      setLoading(true);

      const response = await axios.patch(
        `/profile/${phaseId}/section/${sectionId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.message === "Section updated successfully") {
        setSuccessMessage("Section updated successfully");
        setIsSuccessDialogOpen(true);
        await fetchProfile(); // Refresh data
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Failed to update section");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsSuccessDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00AB8E]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  if (!profileData || !profileData.sections?.length) {
    return (
      <div className="text-center text-gray-600 p-4">
        No profile data available
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <SuccessDialog
        open={isSuccessDialogOpen}
        handleClose={handleDialogClose}
        message={successMessage}
      />

      {/* Phase Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#00AB8E]">
          {profileData.phaseDetails.title}
        </h1>
        <div className="h-1 w-20 bg-[#00AB8E] mt-2"></div>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {profileData.sections.map((section) => (
          <ProfileBlock
            key={section.id}
            sectionId={section.id}
            icon={section.section_icon}
            title={section.section_title}
            content={section.content}
            reference={section.reference_text}
            isEditing={isEditing}
            onUpdate={handleSectionUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default PhaseProfile;

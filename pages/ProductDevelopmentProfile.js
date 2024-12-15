import React, { useState, useEffect } from 'react';
import {
  Book,
  Boxes,
  Cog,
  LineChart,
  Microscope,
  Puzzle,
  ShieldCheck,
  Trophy,
  FileText
} from 'lucide-react';
import axios from '../utils/axiosInstance';
import SuccessDialog from './SuccessDialog';

const iconMap = {
  Book,
  Puzzle,
  Cog,
  Microscope,
  LineChart,
  ShieldCheck,
  Trophy,
  Boxes
};

const ProductDevelopmentProfile = ({ isEditing }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProductDevelopmentData();
  }, []);

  const fetchProductDevelopmentData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/product-development-sections');
      
      // Ensure we have an array to work with
      let sectionsData = [];
      
      // Check if response.data exists and handle different response structures
      if (response.data) {
        if (Array.isArray(response.data)) {
          sectionsData = response.data;
        } else if (response.data.sections) {
          sectionsData = response.data.sections;
        } else if (typeof response.data === 'object') {
          sectionsData = [response.data];
        }
      }
      
      console.log('Processed sections data:', sectionsData);
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch product development data');
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionUpdate = async (sectionId, updateData) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `/product-development-sections/${sectionId}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.message === 'Section updated successfully') {
        setSuccessMessage('Section updated successfully');
        setIsSuccessDialogOpen(true);
        await fetchProductDevelopmentData();
      }
    } catch (error) {
      console.error('Update error:', error);
      setError(error.response?.data?.message || 'Failed to update section');
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
    return (
      <div className="text-center text-red-600 p-4">
        {error}
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

      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#00AB8E]">
          Product Development Overview
        </h1>
        <div className="h-1 w-20 bg-[#00AB8E] mt-2"></div>
      </div>

      {/* Grid Layout for Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section) => {
          const IconComponent = iconMap[section.icon_name] || FileText;
          
          return (
            <div key={section.id} className="relative bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                {/* Icon Block */}
                <div className="bg-[#00AB8E] bg-opacity-10 p-3 rounded-lg flex-shrink-0">
                  <IconComponent className="text-[#00AB8E] w-6 h-6" />
                </div>

                {/* Content Block */}
                <div className="flex-1">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        defaultValue={section.section_title}
                        onBlur={(e) => handleSectionUpdate(section.id, {
                          section_title: e.target.value,
                          content: section.content,
                          reference_text: section.reference_text
                        })}
                        className="w-full mb-2 p-2 text-lg font-semibold border rounded focus:ring-2 focus:ring-[#00AB8E] focus:outline-none"
                      />
                      <textarea
                        defaultValue={section.content}
                        onBlur={(e) => handleSectionUpdate(section.id, {
                          section_title: section.section_title,
                          content: e.target.value,
                          reference_text: section.reference_text
                        })}
                        className="w-full p-2 text-gray-600 border rounded focus:ring-2 focus:ring-[#00AB8E] focus:outline-none"
                        rows={3}
                      />
                      <input
                        type="text"
                        defaultValue={section.reference_text || ''}
                        onBlur={(e) => handleSectionUpdate(section.id, {
                          section_title: section.section_title,
                          content: section.content,
                          reference_text: e.target.value
                        })}
                        className="w-full mt-2 p-2 text-sm text-gray-400 border rounded focus:ring-2 focus:ring-[#00AB8E] focus:outline-none"
                        placeholder="Reference (optional)"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {section.section_title}
                      </h3>
                      <p className="text-gray-600">
                        {section.content}
                      </p>
                      {section.reference_text && (
                        <p className="text-sm text-gray-400 mt-2 italic">
                          {section.reference_text}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {section.id !== sections.length && (
                <div className="absolute -right-4 top-1/2 w-4 h-[2px] bg-[#00AB8E] transform -translate-y-1/2 hidden md:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductDevelopmentProfile;
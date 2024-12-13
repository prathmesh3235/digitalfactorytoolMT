import axiosInstance from './axiosInstance';

export const getPhaseMatrix = async (phaseId) => {
    try {
        const response = await axiosInstance.get(`/matrix/phase/${phaseId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching matrix data:', error);
        throw error;
    }
};

export const createMatrixCategory = async (categoryData) => {
    try {
        const response = await axiosInstance.post('/matrix/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating matrix category:', error);
        throw error;
    }
};

export const updateMatrixCategory = async (categoryId, categoryData) => {
    try {
        const response = await axiosInstance.patch(`/matrix/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating matrix category:', error);
        throw error;
    }
};

export const deleteMatrixCategory = async (categoryId) => {
    try {
        const response = await axiosInstance.delete(`/matrix/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting matrix category:', error);
        throw error;
    }
};
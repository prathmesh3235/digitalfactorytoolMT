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

export const updateCategoryTitle = async (phaseId, categoryType, title) => {
    try {
        const response = await axiosInstance.patch(`/matrix/category-titles/${phaseId}`, {
            categoryType,
            title
        });
        return response.data;
    } catch (error) {
        console.error('Error updating category title:', error);
        throw error;
    }
};

export const updateMatrixContent = async (id, content) => {
    try {
        const response = await axiosInstance.patch(`/matrix/categories/${id}`, content);
        return response.data;
    } catch (error) {
        console.error('Error updating matrix content:', error);
        throw error;
    }
};

export const createMatrixContent = async (content) => {
    try {
        const response = await axiosInstance.post('/matrix/categories', content);
        return response.data;
    } catch (error) {
        console.error('Error creating matrix content:', error);
        throw error;
    }
};

export const deleteMatrixContent = async (id) => {
    try {
        const response = await axiosInstance.delete(`/matrix/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting matrix content:', error);
        throw error;
    }
};
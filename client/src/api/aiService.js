import apiClient from './apiClient.js';

export const generateDescription = (nombre, categoria) => {
    return apiClient('ai/generate-description', {
        body: { nombre, categoria },
        
    });
};
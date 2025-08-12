import apiClient from "./apiClient";

export const getCategories = (searchTerm= '') => {
    const endpoint = searchTerm
        ? `categorias?search=${encodeURIComponent(searchTerm)}`
        : 'categorias';
    return apiClient(endpoint);
};

export const getCategoryById = (id) => {
    return apiClient(`categorias/${id}`);
};

export const createCategory = (categoryData) => {
    return apiClient('categorias', {
        body: categoryData,
    });
};

export const updateCategory = (id, categoryData) => {
    return apiClient(`categorias/${id}`,{
        method: 'PUT',
        body: categoryData,
    });
};

export const deleteCategory =  (id) => {
    return apiClient (`categorias/${id}`,{
        method: 'DELETE',
    });
};
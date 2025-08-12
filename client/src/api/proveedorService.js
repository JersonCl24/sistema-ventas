import apiClient from "./apiClient";

export const getProveedores = (searchTerm = '') => {
    const endpoint = searchTerm
        ? `proveedores?search=${encodeURIComponent(searchTerm)}`
        : 'proveedores';
    return apiClient(endpoint);
};

export const getProveedorById = (id) => {
    return apiClient(`proveedores/${id}`);
};

export const createProveedor = (proveedorData) => {
    return apiClient ('proveedores',{
        body: proveedorData,
    });
};

export const updateProveedor = (id, proveedorData) => {
    return apiClient(`proveedores/${id}`,{
        method: 'PUT',
        body: proveedorData,
    });
};

export const deleteProveedor = (id) => {
    return apiClient(`proveedores/${id}`,{
        method: 'DELETE',
    });
};
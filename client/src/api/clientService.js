import apiClient from "./apiClient";

export const getClients = (searchTerm = '') => {
    const endpoint = searchTerm
        ? `clientes?search=${encodeURIComponent(searchTerm)}`
        : 'clientes';
    return apiClient(endpoint);
};
export const getClientById = (id) => {
    return apiClient(`clientes/${id}`);
};

export const createClient = (clientData) => {
    return apiClient('clientes',{
        body: clientData,
    })
};

export const updateClient = (id, clientData) => {
    return apiClient(`clientes/${id}`,{
        method: 'PUT',
        body: clientData,
    })
};

export const deleteClient = (id) => {
    return apiClient(`clientes/${id}`,{ 
        method: 'DELETE',
    });
};
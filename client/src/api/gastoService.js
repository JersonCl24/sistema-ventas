import apiClient from '../api/apiClient';

export const getGastos =  (searchTerm = '' ) => {
    const endpoint = searchTerm 
        ? `gastos?search=${encodeURIComponent(searchTerm)}` 
        : 'gastos';
    return apiClient(endpoint);
};

export const getGastoById = (id) => {
    return apiClient( `gastos/${id}` );
};

export const createGasto =  (gastoData) => {
    return apiClient('gastos',{
        body: gastoData,
    });
};

export const updateGasto =  (id, gastoData) => {
    return apiClient(`gastos/${id}`, {
        method: 'PUT',
        body: gastoData,
    })
};

export const deleteGasto = async (id) => {
    return apiClient(`gastos/${id}`,{
        method: 'DELETE',
    })
};
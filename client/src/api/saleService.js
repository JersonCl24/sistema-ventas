import apiClient from '../api/apiClient';

export const getSales =  (searchTerm = '') => {
    // Si hay un término de búsqueda, lo añadimos como un query parameter a la URL.
    // Si no, simplemente pedimos todos los productos.
    const endpoint = searchTerm 
        ? `ventas?search=${encodeURIComponent(searchTerm)}` 
        : 'ventas';
    return apiClient(endpoint);
};

export const createSale = (saleData) => {
    return apiClient('ventas',{
        body: saleData,
    });
};

// NUEVA FUNCIÓN: Para obtener los detalles de una sola venta
export const getSaleById = (id) => {
    return apiClient(`ventas/${id}`);
};
// NUEVA FUNCIÓN: Para actualizar el estado de una venta
export const updateSaleStatus = (id, status) => {
    // 1. El método correcto para una actualización parcial es PATCH.
    // 2. El endpoint correcto, según tu código anterior, es /estado.
    // 3. El 'body' debe ser un objeto para que se convierta a JSON.
    return apiClient(`ventas/${id}/estado`, {
        method: 'PATCH',
        body: { estado: status },
    });
};
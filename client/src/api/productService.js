import apiClient from "./apiClient";
// Obtener todos los productos (GET)
export const getProducts = (searchTerm = '') => {
    // Si hay un término de búsqueda, lo añadimos como un query parameter a la URL.
    // Si no, simplemente pedimos todos los productos.
    const endpoint = searchTerm 
        ? `productos?search=${encodeURIComponent(searchTerm)}` 
        : 'productos';
    return apiClient(endpoint);
};

// Obtener un solo producto por su ID (GET)
export const getProductById = (id) => {
    return apiClient(`productos/${id}`);
};

// Crear un nuevo producto (POST)
export const createProduct = (productData) => {
    // Al pasar un 'body', apiClient sabe que debe ser un POST.
    return apiClient('productos', {
        body: productData,
    });
};

// Actualizar un producto existente (PUT)
export const updateProduct = (id, productData) => {
    // Aquí sí especificamos el método porque no es GET ni POST.
    return apiClient(`productos/${id}`, {
        method: 'PUT',
        body: productData,
    });
};

// Eliminar un producto por su ID (DELETE)
export const deleteProduct = (id) => {
    return apiClient(`productos/${id}`, {
        method: 'DELETE',
    });
};
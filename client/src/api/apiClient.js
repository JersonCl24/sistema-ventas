const API_BASE_URL = 'http://localhost:4000/api';

// Función auxiliar para obtener el token del localStorage
const getAuthToken = () => localStorage.getItem('token');

/**
 * Cliente de API para realizar peticiones fetch al backend.
 * @param {string} endpoint - El endpoint de la API al que se llamará (ej: 'productos').
 * @param {object} options - Opciones de configuración para fetch (method, body, etc.).
 * @returns {Promise<any>} - La respuesta de la API en formato JSON.
 */
const apiClient = async (endpoint, { body, ...customConfig } = {}) => {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        method: body ? 'POST' : 'GET', // Método por defecto
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                window.location.assign('/login'); 
                return Promise.reject({ message: 'Tu sesión ha expirado.' });
            }
            const errorData = await response.json();
            return Promise.reject(errorData);
        }

        if (response.status === 204) { // No Content
            return Promise.resolve();
        }

        return await response.json();

    } catch (error) {
        console.error('Error de red o de API:', error);
        return Promise.reject({ message: 'No se pudo conectar con el servidor.' });
    }
};

export default apiClient;
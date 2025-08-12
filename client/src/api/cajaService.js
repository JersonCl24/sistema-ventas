// src/api/cajaService.js
import apiClient from './apiClient.js';

// Obtener el saldo actual de la caja
export const getSaldoActual = () => {
    return apiClient('caja/saldo');
};

// Obtener el historial de movimientos
export const getMovimientos = () => {
    return apiClient('caja/movimientos');
};

// Crear un nuevo ajuste manual de caja
export const createAjuste = (ajusteData) => {
    return apiClient('caja/ajuste', {
        method: 'POST',
        body: ajusteData,
    });
};
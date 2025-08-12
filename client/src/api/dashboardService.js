import apiClient from './apiClient.js';

const buildQueryString = (params) => {
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : '';
};

export const getDashboardSummary = (dateParams = {}) => {
    const queryString = buildQueryString(dateParams);
    return apiClient(`dashboard/summary${queryString}`);
};

export const getSalesOverTime = (dateParams = {}) => {
    const queryString = buildQueryString(dateParams);
    return apiClient(`dashboard/sales-over-time${queryString}`);
};

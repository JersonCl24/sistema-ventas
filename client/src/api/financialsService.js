import apiClient from './apiClient.js';

const buildQueryString = (params) => {
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : '';
};

export const getFinancialSummary = (dateParams = {}) => {
    const queryString = buildQueryString(dateParams);
    return apiClient(`financials/summary${queryString}`);
};
export const getFinancialBreakdown = (dateParams = {}) => {
    const queryString = buildQueryString(dateParams);
    return apiClient(`financials/breakdown${queryString}`);
};
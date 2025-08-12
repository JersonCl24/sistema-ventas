import React from 'react';

const SummaryCard = ({ title, value, isCurrency = false }) => {
    const formattedValue = isCurrency 
        ? `S/ ${Number(value).toFixed(2)}` 
        : Number(value).toLocaleString('es-PE');

    const getCardColor = () => {
        if (title.includes('Ganancia')) return 'from-green-500 to-green-700';
        if (title.includes('Gastos')) return 'from-red-500 to-red-700';
        if (title.includes('Ventas')) return 'from-blue-500 to-blue-700';
        return 'from-gray-600 to-gray-800';
    }

    return (
        <div className={`bg-gradient-to-br ${getCardColor()} p-6 rounded-lg shadow-lg text-white`}>
            <h3 className="text-md font-semibold text-gray-200 uppercase tracking-wider">{title}</h3>
            <p className="text-4xl font-bold mt-2">{formattedValue}</p>
        </div>
    );
};

export default SummaryCard;
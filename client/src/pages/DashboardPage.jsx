import React, { useState, useEffect, useCallback } from 'react';
import { getDashboardSummary, getSalesOverTime } from '../api/dashboardService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { Calendar, BarChart2, Users, Package, DollarSign, TrendingUp, LineChart as LineChartIcon } from 'lucide-react';

// --- Componente de Tarjeta de Resumen (Rediseñado) ---
const SummaryCard = ({ title, value, icon, isCurrency = false, color = 'blue' }) => {
    const formattedValue = isCurrency 
        ? `S/ ${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : Number(value).toLocaleString('es-PE');

    const colorClasses = {
        blue: 'border-blue-500 text-blue-400',
        green: 'border-green-500 text-green-400',
        red: 'border-red-500 text-red-400',
        gray: 'border-gray-500 text-gray-400',
    };

    return (
        <div className={`bg-slate-800/50 p-6 rounded-lg border border-slate-700 border-l-4 ${colorClasses[color]} flex items-center gap-6 transition-all hover:bg-slate-800/80`}>
            <div className={`p-3 rounded-lg bg-slate-900 ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <p className="text-3xl font-bold text-white mt-1">{formattedValue}</p>
            </div>
        </div>
    );
};


// --- Componente de Filtros de Fecha (Estilo Mejorado) ---
const DateFilter = ({ onFilterChange }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [customDates, setCustomDates] = useState({ start: '', end: '' });

    const formatDate = (date) => date.toISOString().split('T')[0];

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        let startDate, endDate;
        const today = new Date();
        
        switch (filter) {
            case 'today':
                startDate = endDate = formatDate(today);
                break;
            case 'week':
                const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) )); // Lunes como primer día
                startDate = formatDate(firstDayOfWeek);
                endDate = formatDate(new Date());
                break;
            case 'month':
                startDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                endDate = formatDate(new Date());
                break;
            case 'all':
            default:
                startDate = endDate = '';
                break;
        }
        setCustomDates({ start: '', end: '' });
        onFilterChange({ startDate, endDate });
    };
    
    const handleCustomDateChange = () => {
        if (customDates.start && customDates.end) {
            if (new Date(customDates.start) > new Date(customDates.end)) {
                alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
                return;
            }
            setActiveFilter('custom');
            onFilterChange({ startDate: customDates.start, endDate: customDates.end });
        }
    };

    const FilterButton = ({ filter, label }) => (
        <button 
            onClick={() => handleFilterClick(filter)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <FilterButton filter="all" label="Histórico" />
                <FilterButton filter="today" label="Hoy" />
                <FilterButton filter="week" label="Semana" />
                <FilterButton filter="month" label="Mes" />
            </div>
            <div className="flex items-center gap-2 flex-grow sm:flex-nowrap flex-wrap">
                <input type="date" value={customDates.start} onChange={e => setCustomDates(prev => ({...prev, start: e.target.value}))} className="bg-slate-700/50 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-slate-300"/>
                <span className="text-slate-500">-</span>
                <input type="date" value={customDates.end} onChange={e => setCustomDates(prev => ({...prev, end: e.target.value}))} className="bg-slate-700/50 p-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-slate-300"/>
                <button onClick={handleCustomDateChange} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md" title="Aplicar rango personalizado">
                    <Calendar size={20} className="text-slate-300"/>
                </button>
            </div>
        </div>
    );
};

// --- Componente Principal del Dashboard ---
const DashboardPage = () => {
    const [summary, setSummary] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateParams, setDateParams] = useState({});

    const loadDashboardData = useCallback(async (params) => {
        try {
            setLoading(true);
            const [summaryData, salesChartData] = await Promise.all([
                getDashboardSummary(params),
                getSalesOverTime(params)
            ]);
            
            setSummary(summaryData);
            const formattedSalesData = salesChartData.map(item => ({
                ...item,
                fecha: new Date(item.fecha).toLocaleDateString('es-PE', { timeZone: 'UTC', month: 'short', day: 'numeric' }),
                total: Number(item.total)
            }));
            setSalesData(formattedSalesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData(dateParams);
    }, [dateParams, loadDashboardData]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            </div>
            
            <DateFilter onFilterChange={setDateParams} />

            {loading ? (
                <div className="text-center p-8 text-slate-400">Actualizando datos...</div>
            ) : error ? (
                <div className="text-center p-8 text-red-400">Error: {error}</div>
            ) : (
                <>
                    {summary && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <SummaryCard title="Ventas Totales" value={summary.totalVentas} icon={<BarChart2 size={24}/>} isCurrency={true} color="blue" />
                            <SummaryCard title="Gastos Totales" value={summary.totalGastos} icon={<DollarSign size={24}/>} isCurrency={true} color="red" />
                            <SummaryCard title="Ganancia Neta" value={summary.gananciaNeta} icon={<TrendingUp size={24}/>} isCurrency={true} color="green" />
                            <SummaryCard title="Total de Clientes" value={summary.totalClientes} icon={<Users size={24}/>} color="gray" />
                            <SummaryCard title="Productos Bajo Stock" value={summary.productosBajoStock} icon={<Package size={24}/>} color="gray" />
                        </div>
                    )}

                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">Ventas a lo Largo del Tiempo</h2>
                        {salesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="fecha" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `S/ ${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#f9fafb' }}
                                        itemStyle={{ color: '#9ca3af' }}
                                        formatter={(value) => [`S/ ${Number(value).toFixed(2)}`, "Total Vendido"]}
                                    />
                                    <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '14px' }}/>
                                    {/* --- CORRECCIÓN AQUÍ --- */}
                                    {/* El <Area> dibuja el gradiente, y el <Line> dibuja la línea visible. */}
                                    {/* El <Line> también mostrará un punto si solo hay un dato. */}
                                    <Area type="monotone" dataKey="total" stroke="transparent" fillOpacity={1} fill="url(#colorTotal)" />
                                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Total Vendido"/>
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[400px] flex flex-col items-center justify-center text-center text-slate-500">
                                <LineChartIcon size={48} className="mb-4"/>
                                <h3 className="text-lg font-semibold text-slate-400">No hay datos de ventas para mostrar</h3>
                                <p className="text-sm">Intenta seleccionar un rango de fechas diferente.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
export default DashboardPage;
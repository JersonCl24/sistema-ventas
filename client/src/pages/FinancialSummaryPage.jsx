
import React, { useState, useEffect, useCallback } from 'react';
import { getFinancialSummary, getFinancialBreakdown } from '../api/financialsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, MinusCircle, ShieldCheck, Calendar, BarChart as BarChartIcon } from 'lucide-react';
import toast from 'react-hot-toast';

// --- Componente de Tarjeta de Resumen (Completo) ---
const SummaryCard = ({ title, value, icon, isCurrency = false, color = 'blue' }) => {
    const formattedValue = isCurrency 
        ? `S/ ${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : Number(value).toLocaleString('es-PE');

    const colorClasses = {
        blue: 'border-blue-500 text-blue-400',
        green: 'border-green-500 text-green-400',
        red: 'border-red-500 text-red-400',
        yellow: 'border-yellow-500 text-yellow-400',
        purple: 'border-purple-500 text-purple-400',
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

// --- Componente de Filtros de Fecha (Completo) ---
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
                const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) ));
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
                toast.error("La fecha de inicio no puede ser posterior a la fecha de fin.");
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


const FinancialSummaryPage = () => {
    const [summary, setSummary] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateParams, setDateParams] = useState({});

    const loadFinancialData = useCallback(async (params) => {
        try {
            setLoading(true);
            const [summaryData, breakdownData] = await Promise.all([
                getFinancialSummary(params),
                getFinancialBreakdown(params)
            ]);
            setSummary(summaryData);
            
            const formattedChartData = breakdownData.map(item => ({
                ...item,
                month: new Date(item.month + '-02').toLocaleDateString('es-PE', { timeZone: 'UTC', month: 'short', year: '2-digit' })
            }));
            setChartData(formattedChartData);

        } catch (err) {
            setError(err.message);
            toast.error("Error al cargar los datos financieros.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFinancialData(dateParams);
    }, [dateParams, loadFinancialData]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Resumen Financiero</h1>
            <DateFilter onFilterChange={setDateParams} />
            
            {loading ? (
                <p className="text-center p-8 text-slate-400">Cargando datos financieros...</p>
            ) : error ? (
                <p className="text-center p-8 text-red-400">Error: {error}</p>
            ) : summary && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SummaryCard title="Ingresos Brutos (Ventas)" value={summary.ingresosBrutos} icon={<TrendingUp size={24}/>} color="blue" isCurrency={true}/>
                        <SummaryCard title="Costo de Productos" value={summary.costoDeProductos} icon={<TrendingDown size={24}/>} color="yellow" isCurrency={true}/>
                        <SummaryCard title="Ganancia Bruta" value={summary.gananciaBruta} icon={<DollarSign size={24}/>} color="green" isCurrency={true}/>
                        <SummaryCard title="Costos de Envío" value={summary.totalEnvio} icon={<MinusCircle size={24}/>} color="red" isCurrency={true}/>
                        <SummaryCard title="Gastos Operativos" value={summary.totalGastos} icon={<MinusCircle size={24}/>} color="red" isCurrency={true}/>
                        <SummaryCard title="Ganancia Neta" value={summary.gananciaNeta} icon={<ShieldCheck size={24}/>} color="purple" isCurrency={true}/>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">Desglose Financiero Mensual</h2>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `S/ ${value / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#f9fafb' }}
                                        formatter={(value, name) => [`S/ ${Number(value).toFixed(2)}`, name]}
                                    />
                                    <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '14px' }}/>
                                    <Bar dataKey="ingresos" name="Ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="costos" name="Costo Productos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="gastos" name="Gastos Operativos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[400px] flex flex-col items-center justify-center text-center text-slate-500">
                                <BarChartIcon size={48} className="mb-4"/>
                                <h3 className="text-lg font-semibold text-slate-400">No hay datos para mostrar en el gráfico</h3>
                                <p className="text-sm">Intenta seleccionar un rango de fechas con actividad.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
export default FinancialSummaryPage;
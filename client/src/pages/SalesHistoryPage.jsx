import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getSales } from '../api/saleService';
import { PlusCircle, Search, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const SalesHistoryPage = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadSales = useCallback(async (searchTerm) => {
        try {
            setLoading(true);
            // Asumimos que tu API/servicio de ventas puede aceptar un término de búsqueda
            const data = await getSales(searchTerm);
            setSales(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'No se pudo cargar el historial de ventas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timerId = setTimeout(() => {
            loadSales(searchTerm);
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchTerm, loadSales]);

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'completado': return 'bg-green-500/20 text-green-400';
            case 'pendiente': return 'bg-yellow-500/20 text-yellow-400';
            case 'enviado': return 'bg-blue-500/20 text-blue-400';
            case 'pagado': return 'bg-cyan-500/20 text-cyan-400';
            case 'cancelado': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (error && sales.length === 0) {
        return <p className="text-center p-4 text-red-500">Error: {error}</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Historial de Ventas</h1>
                <Link to="/ventas/nueva">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <PlusCircle size={20} />
                        Registrar Venta
                    </button>
                </Link>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar por ID de venta o nombre de cliente..."
                    className="w-full bg-gray-700 text-white p-3 pl-10 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
                            <tr>
                                <th className="p-4">ID Venta</th>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4 text-right">Total</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-400">Cargando ventas...</td>
                                </tr>
                            ) : sales.length > 0 ? (
                                sales.map(sale => (
                                    <tr key={sale.id} className="hover:bg-gray-700/50">
                                        <td className="p-4 font-medium">#{sale.id}</td>
                                        <td className="p-4 text-gray-400">{new Date(sale.fecha).toLocaleDateString()}</td>
                                        <td className="p-4">{sale.cliente}</td>
                                        <td className="p-4 text-right font-semibold">S/ {Number(sale.total).toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(sale.estado)}`}>
                                                {sale.estado || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Link to={`/ventas/${sale.id}`} className="inline-flex items-center justify-center p-2 bg-gray-600 hover:bg-gray-500 rounded-full text-white transition-colors" title="Ver Detalles">
                                                <Eye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-400">No se encontraron ventas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesHistoryPage;
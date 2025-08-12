
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getGastos, deleteGasto } from '../api/gastoService';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const GastoManagementPage = () => {
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Usamos useCallback para optimizar la función de carga de datos
    const loadGastos = useCallback(async (searchTerm) => {
        try {
            setLoading(true);
            // Asumimos que tu API/servicio de gastos puede aceptar un término de búsqueda
            // Si no es así, tendrías que filtrar los datos aquí en el frontend.
            const data = await getGastos(searchTerm); 
            setGastos(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'No se pudieron cargar los gastos');
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect se ejecuta cuando el término de búsqueda cambia
    useEffect(() => {
        const timerId = setTimeout(() => {
            loadGastos(searchTerm);
        }, 300); // Debounce para no llamar a la API en cada tecla

        return () => clearTimeout(timerId);
    }, [searchTerm, loadGastos]);

    const handleDelete = async (id) => {
        // Usamos toast.promise para una mejor UX durante la eliminación
        toast.promise(
            deleteGasto(id).then(() => {
                // Si la eliminación es exitosa, recargamos la lista
                loadGastos(searchTerm);
            }),
            {
                loading: 'Eliminando gasto...',
                success: 'Gasto eliminado exitosamente.',
                error: (err) => `Error: ${err.message || 'No se pudo eliminar el gasto.'}`,
            }
        );
    };

    if (error && gastos.length === 0) {
        return <p className="text-center p-4 text-red-500">Error: {error}</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Gestión de Gastos</h1>
                <Link to="/gastos/nuevo">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <PlusCircle size={20} />
                        Añadir Gasto
                    </button>
                </Link>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar gasto por descripción..."
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
                                <th className="p-4">ID</th>
                                <th className="p-4">Descripción</th>
                                <th className="p-4 text-right">Monto</th>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Categoría</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-400">Cargando gastos...</td>
                                </tr>
                            ) : gastos.length > 0 ? (
                                gastos.map(gasto => (
                                    <tr key={gasto.id} className="hover:bg-gray-700/50">
                                        <td className="p-4 font-medium">{gasto.id}</td>
                                        <td className="p-4">{gasto.descripcion}</td>
                                        <td className="p-4 text-right font-semibold">S/ {Number(gasto.monto).toFixed(2)}</td>
                                        <td className="p-4">{new Date(gasto.fecha).toLocaleDateString()}</td>
                                        <td className="p-4">{gasto.categoria_gasto || 'N/A'}</td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <Link to={`/gastos/editar/${gasto.id}`}>
                                                    <button className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-white transition-colors" title="Editar">
                                                        <Edit size={16} />
                                                    </button>
                                                </Link>
                                                <button className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors" onClick={() => handleDelete(gasto.id)} title="Eliminar">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-400">No se encontraron gastos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GastoManagementPage;

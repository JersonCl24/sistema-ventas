/*
* =================================================================
* ARCHIVO: src/pages/ProveedorManagementPage.jsx (REFACTORIZADO CON TAILWIND)
* =================================================================
* Descripción: Página de gestión de proveedores rediseñada con un estilo
* moderno, búsqueda integrada y notificaciones toast.
*/
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProveedores, deleteProveedor } from '../api/proveedorService';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ProveedorManagementPage = () => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadProveedores = useCallback(async (searchTerm) => {
        try {
            setLoading(true);
            // Asumimos que tu API/servicio de proveedores puede aceptar un término de búsqueda
            const data = await getProveedores(searchTerm);
            setProveedores(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'No se pudieron cargar los proveedores');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timerId = setTimeout(() => {
            loadProveedores(searchTerm);
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchTerm, loadProveedores]);

    const handleDelete = async (id) => {
        toast.promise(
            deleteProveedor(id).then(() => {
                loadProveedores(searchTerm);
            }),
            {
                loading: 'Eliminando proveedor...',
                success: 'Proveedor eliminado exitosamente.',
                error: (err) => `Error: ${err.message || 'No se pudo eliminar el proveedor.'}`,
            }
        );
    };

    if (error && proveedores.length === 0) {
        return <p className="text-center p-4 text-red-500">Error: {error}</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Gestión de Proveedores</h1>
                <Link to="/proveedores/nuevo">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <PlusCircle size={20} />
                        Añadir Proveedor
                    </button>
                </Link>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar proveedor por nombre de empresa..."
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
                                <th className="p-4">Empresa</th>
                                <th className="p-4">Contacto</th>
                                <th className="p-4">Teléfono</th>
                                <th className="p-4">Email</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-400">Cargando proveedores...</td>
                                </tr>
                            ) : proveedores.length > 0 ? (
                                proveedores.map(prov => (
                                    <tr key={prov.id} className="hover:bg-gray-700/50">
                                        <td className="p-4 font-medium">{prov.id}</td>
                                        <td className="p-4">{prov.nombre_empresa}</td>
                                        <td className="p-4 text-gray-400">{prov.contacto_nombre || 'N/A'}</td>
                                        <td className="p-4 text-gray-400">{prov.telefono || 'N/A'}</td>
                                        <td className="p-4 text-gray-400">{prov.email || 'N/A'}</td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <Link to={`/proveedores/editar/${prov.id}`}>
                                                    <button className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-white transition-colors" title="Editar">
                                                        <Edit size={16} />
                                                    </button>
                                                </Link>
                                                <button className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors" onClick={() => handleDelete(prov.id)} title="Eliminar">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-400">No se encontraron proveedores.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProveedorManagementPage;

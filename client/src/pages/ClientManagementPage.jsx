
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getClients, deleteClient } from '../api/clientService';
import { PlusCircle, Edit, Trash2, Search, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const ClientManagementPage = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadClients = useCallback(async (searchQuery) => {
        try {
            setLoading(true);
            const data = await getClients(searchQuery);
            setClients(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'No se pudieron cargar los clientes');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timerId = setTimeout(() => {
            loadClients(searchTerm);
        }, 300);
        return () => clearTimeout(timerId);
    }, [searchTerm, loadClients]);

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-semibold">¿Seguro que quieres eliminar este cliente?</p>
                <div className="flex gap-2">
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
                        onClick={() => {
                            toast.promise(
                                deleteClient(id).then(() => loadClients(searchTerm)),
                                {
                                    loading: 'Eliminando...',
                                    success: 'Cliente eliminado.',
                                    error: (err) => `Error: ${err.message || 'No se pudo eliminar.'}`,
                                }
                            );
                            toast.dismiss(t.id);
                        }}
                    >
                        Confirmar
                    </button>
                    <button
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-1 px-3 rounded-lg text-sm"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), {
            duration: 6000,
        });
    };

    if (error && clients.length === 0) {
        return <p className="text-center p-4 text-red-500">Error: {error}</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Gestión de Clientes</h1>
                <Link to="/clientes/nuevo">
                    <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto">
                        <PlusCircle size={20} />
                        Añadir Cliente
                    </button>
                </Link>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar cliente por nombre..."
                    className="w-full bg-slate-800/50 text-white p-3 pl-10 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            </div>

            <div className="bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                            <tr>
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Nombre</th>
                                <th className="p-4 font-semibold">Contacto</th>
                                <th className="p-4 font-semibold">Fecha de Registro</th>
                                <th className="p-4 font-semibold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center p-8 text-slate-500">Cargando clientes...</td>
                                </tr>
                            ) : clients.length > 0 ? (
                                clients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 font-medium text-white">{client.id}</td>
                                        <td className="p-4 text-slate-300">{client.nombre}</td>
                                        <td className="p-4 text-slate-400">{client.contacto || 'N/A'}</td>
                                        <td className="p-4 text-slate-400">{new Date(client.fecha_registro).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <Link to={`/clientes/editar/${client.id}`}>
                                                    <button className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-full text-yellow-400 transition-colors" title="Editar">
                                                        <Edit size={16} />
                                                    </button>
                                                </Link>
                                                <button className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-full text-red-400 transition-colors" onClick={() => handleDelete(client.id)} title="Eliminar">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-8">
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <Users size={40} />
                                            <h3 className="font-semibold">No se encontraron clientes</h3>
                                            <p className="text-sm">Intenta con otra búsqueda o añade un nuevo cliente.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientManagementPage;
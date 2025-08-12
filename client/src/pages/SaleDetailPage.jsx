
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSaleById, updateSaleStatus } from '../api/saleService';
import toast from 'react-hot-toast';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const SaleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const loadSaleDetails = async () => {
            try {
                setLoading(true);
                const saleData = await getSaleById(id);
                setSale(saleData);
                setNewStatus(saleData.estado);
            } catch (err) {
                setError(err.message);
                toast.error("Error al cargar los detalles de la venta.");
            } finally {
                setLoading(false);
            }
        };
        loadSaleDetails();
    }, [id]);

    const handleStatusUpdate = async () => {
        if (isUpdating || newStatus === sale.estado) return;
        
        setIsUpdating(true);
        try {
            const result = await updateSaleStatus(id, newStatus);
            toast.success(result.message || 'Estado actualizado exitosamente.');
            setSale({ ...sale, estado: newStatus });
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };
    
    // Función para obtener clases de color según el estado
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

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando detalles...</p>;
    if (error) return <p className="text-center p-8 text-red-500">Error: {error}</p>;
    if (!sale) return <p className="text-center p-8 text-gray-400">No se encontraron detalles para esta venta.</p>;

    return (
        <div className="space-y-6">
            <div>
                <Link to="/ventas" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4">
                    <ArrowLeft size={20} />
                    Volver al Historial
                </Link>
                <h1 className="text-3xl font-bold">Detalle de Venta #{sale.id}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Principal: Productos */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-3">Productos Vendidos</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-gray-400 uppercase text-sm">
                                <tr>
                                    <th className="py-3">Producto</th>
                                    <th className="py-3 text-center">Cantidad</th>
                                    <th className="py-3 text-right">Precio Unit.</th>
                                    <th className="py-3 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {sale.detalles.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-3">{item.producto_nombre}</td>
                                        <td className="py-3 text-center">{item.cantidad}</td>
                                        <td className="py-3 text-right">S/ {Number(item.precio_unitario).toFixed(2)}</td>
                                        <td className="py-3 text-right font-semibold">S/ {(item.cantidad * item.precio_unitario).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Columna Lateral: Resumen y Acciones */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-3">Resumen</h3>
                        <div className="space-y-3 text-gray-300">
                            <p><strong>Cliente:</strong> {sale.cliente}</p>
                            <p><strong>Fecha:</strong> {new Date(sale.fecha).toLocaleString()}</p>
                            <div className="flex items-center gap-2">
                                <strong>Estado:</strong>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(sale.estado)}`}>
                                    {sale.estado}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Actualizar Estado</h3>
                        <div className="flex gap-2">
                            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="Pendiente">Pendiente</option>
                                <option value="Pagado">Pagado</option>
                                <option value="Enviado">Enviado</option>
                                <option value="Completado">Completado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                            <button onClick={handleStatusUpdate} disabled={isUpdating || newStatus === sale.estado} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                                <RefreshCw size={16} className={isUpdating ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal:</span>
                                <span>S/ {Number(sale.total - sale.costo_envio).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Costo de Envío:</span>
                                <span>S/ {Number(sale.costo_envio).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold border-t border-gray-700 pt-3 mt-3">
                                <span>Total:</span>
                                <span>S/ {Number(sale.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaleDetailPage;
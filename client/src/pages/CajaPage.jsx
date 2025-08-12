
import React, { useState, useEffect, useCallback } from 'react';
import { getSaldoActual, getMovimientos, createAjuste } from '../api/cajaService';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, PlusCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CajaPage = () => {
    const [saldo, setSaldo] = useState(0);
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAjusteModal, setShowAjusteModal] = useState(false);

    const loadCajaData = useCallback(async () => {
        try {
            setLoading(true);
            const [saldoData, movimientosData] = await Promise.all([
                getSaldoActual(),
                getMovimientos()
            ]);
            setSaldo(saldoData.saldo_actual);
            setMovimientos(movimientosData);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'No se pudieron cargar los datos de la caja');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCajaData();
    }, [loadCajaData]);

    const handleAjusteSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const ajuste = {
            concepto: formData.get('concepto'),
            monto: parseFloat(formData.get('monto'))
        };

        if (!ajuste.concepto || isNaN(ajuste.monto)) {
            toast.error("Por favor, completa todos los campos del ajuste.");
            return;
        }

        toast.promise(
            createAjuste(ajuste).then(() => {
                setShowAjusteModal(false);
                loadCajaData(); // Recargar todos los datos
            }),
            {
                loading: 'Registrando ajuste...',
                success: 'Ajuste registrado exitosamente.',
                error: (err) => `Error: ${err.message || 'No se pudo registrar el ajuste.'}`,
            }
        );
    };

    const formatCurrency = (value) => `S/ ${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Gestión de Caja</h1>
                <button 
                    onClick={() => setShowAjusteModal(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
                >
                    <PlusCircle size={20} />
                    Realizar Ajuste
                </button>
            </div>

            {/* Saldo Actual */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
                <p className="text-sm text-slate-400 font-medium uppercase">Saldo Actual en Caja</p>
                <p className="text-5xl font-bold text-green-400 mt-2">{formatCurrency(saldo)}</p>
            </div>

            {/* Historial de Movimientos */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
                <h2 className="text-xl font-bold text-white p-4 border-b border-slate-700">Historial de Movimientos</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                            <tr>
                                <th className="p-4 font-semibold">Fecha</th>
                                <th className="p-4 font-semibold">Concepto</th>
                                <th className="p-4 font-semibold text-right">Monto</th>
                                <th className="p-4 font-semibold text-right">Saldo Resultante</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center p-8 text-slate-500">Cargando movimientos...</td></tr>
                            ) : movimientos.length > 0 ? (
                                movimientos.map(mov => (
                                    <tr key={mov.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 text-slate-400">{new Date(mov.fecha).toLocaleString()}</td>
                                        <td className="p-4 text-white">{mov.concepto}</td>
                                        <td className={`p-4 text-right font-semibold ${mov.monto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {mov.monto >= 0 ? '+' : ''}{formatCurrency(mov.monto)}
                                        </td>
                                        <td className="p-4 text-right text-slate-300">{formatCurrency(mov.saldo_resultante)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center p-8 text-slate-500">No hay movimientos registrados.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para Ajuste Manual */}
            {showAjusteModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md animate-fade-in-up border border-slate-700">
                        <div className="flex justify-between items-center p-4 border-b border-slate-700">
                            <h2 className="text-xl font-bold text-white">Ajuste Manual de Caja</h2>
                            <button onClick={() => setShowAjusteModal(false)} className="p-1 text-slate-400 hover:text-white"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleAjusteSubmit} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="concepto" className="block text-sm font-medium text-slate-300 mb-1">Concepto</label>
                                <input type="text" name="concepto" required className="w-full bg-slate-700/50 text-white p-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="monto" className="block text-sm font-medium text-slate-300 mb-1">Monto (S/)</label>
                                <input type="number" name="monto" step="0.01" required placeholder="Ej: 50.00 o -20.00" className="w-full bg-slate-700/50 text-white p-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <p className="text-xs text-slate-500 mt-1">Usa un número positivo para ingresos y negativo para egresos.</p>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAjusteModal(false)} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg">Cancelar</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Guardar Ajuste</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CajaPage;
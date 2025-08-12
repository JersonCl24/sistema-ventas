import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createGasto, getGastoById, updateGasto } from '../api/gastoService';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';

const GastoFormPage = () => {
    const [gasto, setGasto] = useState({
        descripcion: '',
        monto: '',
        fecha: '',
        categoria_gasto: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            const loadGasto = async () => {
                try {
                    setIsLoading(true);
                    const data = await getGastoById(id);
                    // Formateamos la fecha para el input type="date" (YYYY-MM-DD)
                    const formattedDate = new Date(data.fecha).toISOString().split('T')[0];
                    setGasto({ ...data, fecha: formattedDate });
                } catch (error) {
                    toast.error("Error al cargar el gasto: " + error.message);
                    navigate('/gastos');
                } finally {
                    setIsLoading(false);
                }
            };
            loadGasto();
        } else {
            // Si es un gasto nuevo, ponemos la fecha actual por defecto
            setGasto(g => ({ ...g, fecha: new Date().toISOString().split('T')[0] }));
            setIsLoading(false);
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGasto({ ...gasto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const gastoData = {
                ...gasto,
                monto: Number(gasto.monto)
            };
            
            if (isEditing) {
                await updateGasto(id, gastoData);
                toast.success('Gasto actualizado exitosamente');
            } else {
                await createGasto(gastoData);
                toast.success('Gasto creado exitosamente');
            }
            navigate('/gastos');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <p className="text-center p-8 text-gray-400">Cargando formulario...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Editar Gasto' : 'Añadir Nuevo Gasto'}</h1>
            
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                
                {/* Fila 1: Descripción */}
                <div className="md:col-span-2">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                    <input type="text" id="descripcion" name="descripcion" value={gasto.descripcion} onChange={handleChange} required className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                {/* Fila 2: Monto, Fecha y Categoría */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="monto" className="block text-sm font-medium text-gray-300 mb-1">Monto (S/)</label>
                        <input type="number" id="monto" name="monto" value={gasto.monto} onChange={handleChange} required step="0.01" className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="fecha" className="block text-sm font-medium text-gray-300 mb-1">Fecha</label>
                        <input type="date" id="fecha" name="fecha" value={gasto.fecha} onChange={handleChange} required className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="categoria_gasto" className="block text-sm font-medium text-gray-300 mb-1">Categoría del Gasto</label>
                        <input type="text" id="categoria_gasto" name="categoria_gasto" value={gasto.categoria_gasto} onChange={handleChange} className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                {/* Fila 3: Botones de Acción */}
                <div className="pt-6 flex justify-end gap-4 border-t border-gray-700">
                    <Link to="/gastos" className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <X size={20} />
                        Cancelar
                    </Link>
                    <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">
                        <Save size={20} />
                        {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Gasto' : 'Guardar Gasto')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GastoFormPage;
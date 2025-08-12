import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createCategory, getCategoryById, updateCategory } from '../api/categoryService';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';

const CategoriaFormPage = () => {
    const [categoria, setCategoria] = useState({ nombre: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            const loadCategoria = async () => {
                try {
                    setIsLoading(true);
                    const data = await getCategoryById(id);
                    setCategoria(data);
                } catch (error) {
                    toast.error("Error al cargar la categoría: " + error.message);
                    navigate('/categorias');
                } finally {
                    setIsLoading(false);
                }
            };
            loadCategoria();
        } else {
            setIsLoading(false);
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e) => {
        setCategoria({ ...categoria, nombre: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            if (isEditing) {
                await updateCategory(id, categoria);
                toast.success('Categoría actualizada exitosamente');
            } else {
                await createCategory(categoria);
                toast.success('Categoría creada exitosamente');
            }
            navigate('/categorias');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <p className="text-center p-8 text-slate-400">Cargando formulario...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">{isEditing ? 'Editar Categoría' : 'Añadir Nueva Categoría'}</h1>
            
            <form onSubmit={handleSubmit} className="bg-slate-800/50 p-8 rounded-lg border border-slate-700 shadow-lg space-y-6">
                
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-slate-300 mb-1">Nombre de la Categoría</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre" 
                        value={categoria.nombre} 
                        onChange={handleChange} 
                        required 
                        className="w-full bg-slate-700/50 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                    />
                </div>

                <div className="pt-6 flex justify-end gap-4 border-t border-slate-700">
                    <Link to="/categorias" className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <X size={20} />
                        Cancelar
                    </Link>
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-blue-400/50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Categoría' : 'Guardar Categoría')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoriaFormPage;
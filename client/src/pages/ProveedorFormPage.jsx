
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createProveedor, getProveedorById, updateProveedor } from '../api/proveedorService';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';

const ProveedorFormPage = () => {
    const [proveedor, setProveedor] = useState({
        nombre_empresa: '',
        contacto_nombre: '',
        telefono: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            const loadProveedor = async () => {
                try {
                    setIsLoading(true);
                    const data = await getProveedorById(id);
                    setProveedor({
                        nombre_empresa: data.nombre_empresa || '',
                        contacto_nombre: data.contacto_nombre || '',
                        telefono: data.telefono || '',
                        email: data.email || ''
                    });
                } catch (error) {
                    toast.error("Error al cargar el proveedor: " + error.message);
                    navigate('/proveedores');
                } finally {
                    setIsLoading(false);
                }
            };
            loadProveedor();
        } else {
            setIsLoading(false);
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProveedor({ ...proveedor, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            if (isEditing) {
                await updateProveedor(id, proveedor);
                toast.success('Proveedor actualizado exitosamente');
            } else {
                await createProveedor(proveedor);
                toast.success('Proveedor creado exitosamente');
            }
            navigate('/proveedores');
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
            <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Editar Proveedor' : 'Añadir Nuevo Proveedor'}</h1>
            
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                
                {/* Fila 1: Nombre de la Empresa y Contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="nombre_empresa" className="block text-sm font-medium text-gray-300 mb-1">Nombre de la Empresa</label>
                        <input type="text" id="nombre_empresa" name="nombre_empresa" value={proveedor.nombre_empresa} onChange={handleChange} required className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="contacto_nombre" className="block text-sm font-medium text-gray-300 mb-1">Nombre del Contacto</label>
                        <input type="text" id="contacto_nombre" name="contacto_nombre" value={proveedor.contacto_nombre} onChange={handleChange} className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                {/* Fila 2: Teléfono y Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
                        <input type="text" id="telefono" name="telefono" value={proveedor.telefono} onChange={handleChange} className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input type="email" id="email" name="email" value={proveedor.email} onChange={handleChange} className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                {/* Fila 3: Botones de Acción */}
                <div className="pt-6 flex justify-end gap-4 border-t border-gray-700">
                    <Link to="/proveedores" className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <X size={20} />
                        Cancelar
                    </Link>
                    <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">
                        <Save size={20} />
                        {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Proveedor' : 'Guardar Proveedor')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProveedorFormPage;
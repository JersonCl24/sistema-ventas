
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createClient, getClientById, updateClient } from '../api/clientService';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';

const ClientFormPage = () => {
    const [client, setClient] = useState({ nombre: '', contacto: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            const loadClient = async () => {
                try {
                    setIsLoading(true);
                    const data = await getClientById(id);
                    // El backend puede devolver un array, nos aseguramos de tomar el primer elemento
                    const clientData = Array.isArray(data) ? data[0] : data;
                    if (clientData) {
                        setClient({
                            nombre: clientData.nombre || '',
                            contacto: clientData.contacto || ''
                        });
                    } else {
                        throw new Error("Cliente no encontrado");
                    }
                } catch (error) {
                    toast.error("Error al cargar el cliente: " + error.message);
                    navigate('/clientes');
                } finally {
                    setIsLoading(false);
                }
            };
            loadClient();
        } else {
            setIsLoading(false);
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient({ ...client, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            if (isEditing) {
                await updateClient(id, client);
                toast.success('Cliente actualizado exitosamente');
            } else {
                await createClient(client);
                toast.success('Cliente creado exitosamente');
            }
            navigate('/clientes');
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
            <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}</h1>
            
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                
                {/* Fila 1: Nombre del Cliente */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">Nombre del Cliente</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre" 
                        value={client.nombre} 
                        onChange={handleChange} 
                        required 
                        className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>

                {/* Fila 2: Contacto */}
                <div>
                    <label htmlFor="contacto" className="block text-sm font-medium text-gray-300 mb-1">Contacto (Email, Teléfono, etc.)</label>
                    <input 
                        type="text" 
                        id="contacto" 
                        name="contacto" 
                        value={client.contacto} 
                        onChange={handleChange} 
                        className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>

                {/* Fila 3: Botones de Acción */}
                <div className="pt-6 flex justify-end gap-4 border-t border-gray-700">
                    <Link to="/clientes" className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <X size={20} />
                        Cancelar
                    </Link>
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Cliente' : 'Guardar Cliente')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientFormPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClients, createClient } from '../api/clientService'; // Se importa createClient
import { getProducts } from '../api/productService';
import { createSale } from '../api/saleService';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, User, UserPlus } from 'lucide-react';

const NewSalePage = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- NUEVOS ESTADOS PARA LA CREACIÓN DE CLIENTES ---
    const [isCreatingClient, setIsCreatingClient] = useState(false);
    const [newClient, setNewClient] = useState({ nombre: '', contacto: '' });
    // ----------------------------------------------------

    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [shippingCost, setShippingCost] = useState(0);
    const [saleItems, setSaleItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [clientsData, productsData] = await Promise.all([
                    getClients(),
                    getProducts()
                ]);
                setClients(clientsData);
                setProducts(productsData);
            } catch (error) {
                toast.error("Error al cargar datos iniciales: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleAddItem = () => {
        if (!selectedProduct || quantity <= 0) {
            toast.error('Por favor, selecciona un producto y una cantidad válida.');
            return;
        }
        const productToAdd = products.find(p => p.id === parseInt(selectedProduct));
        if (!productToAdd) return;
        if (quantity > productToAdd.stock) {
            toast.error(`No puedes añadir ${quantity} unidades. Solo quedan ${productToAdd.stock} en stock.`);
            return;
        }
        const existingItem = saleItems.find(item => item.producto_id === productToAdd.id);
        if (existingItem) {
            toast.error('Este producto ya está en la venta.');
            return;
        }
        const newItem = {
            producto_id: productToAdd.id,
            nombre: productToAdd.nombre,
            cantidad: quantity,
            precio_unitario: Number(productToAdd.precio_venta),
        };
        setSaleItems([...saleItems, newItem]);
        setSelectedProduct('');
        setQuantity(1);
    };

    const handleRemoveItem = (productIdToRemove) => {
        setSaleItems(saleItems.filter(item => item.producto_id !== productIdToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        let finalClientId = selectedClient;

        try {
            // Paso 1: Si estamos creando un cliente, lo guardamos primero
            if (isCreatingClient) {
                if (!newClient.nombre.trim()) {
                    toast.error('El nombre del nuevo cliente es obligatorio.');
                    setIsSubmitting(false);
                    return;
                }
                const createdClient = await createClient(newClient);
                finalClientId = createdClient.id; // Usamos el ID del nuevo cliente
                toast.success(`Cliente "${createdClient.nombre}" creado exitosamente.`);
            }

            // Paso 2: Validamos que tengamos un cliente y productos
            if (!finalClientId || saleItems.length === 0) {
                toast.error('Debes seleccionar o crear un cliente y añadir al menos un producto.');
                setIsSubmitting(false);
                return;
            }

            // Paso 3: Creamos la venta con el ID del cliente (existente o nuevo)
            const saleData = {
                cliente_id: parseInt(finalClientId),
                costo_envio: shippingCost,
                productos: saleItems.map(({ producto_id, cantidad, precio_unitario }) => ({
                    producto_id,
                    cantidad,
                    precio_unitario
                }))
            };
            const result = await createSale(saleData);
            toast.success(`Venta #${result.id} registrada exitosamente.`);
            navigate('/ventas');

        } catch (error) {
            toast.error(`Error al registrar la venta: ${error.message}`);
            setIsSubmitting(false);
        }
    };

    const subtotal = saleItems.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);
    const total = subtotal + shippingCost;
    const currentProduct = products.find(p => p.id === parseInt(selectedProduct));
    const maxQuantity = currentProduct ? currentProduct.stock : 9999;

    if (loading) {
        return <p className="text-center p-8 text-gray-400">Cargando datos...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Registrar Nueva Venta</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 bg-gray-800 p-8 rounded-lg shadow-lg space-y-8">
                    {/* --- SECCIÓN DE CLIENTE MODIFICADA --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">1. Cliente</label>
                        <div className="flex items-center gap-4 mb-4">
                            <button type="button" onClick={() => setIsCreatingClient(false)} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${!isCreatingClient ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                <User size={18} /> Seleccionar Existente
                            </button>
                            <button type="button" onClick={() => setIsCreatingClient(true)} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${isCreatingClient ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                <UserPlus size={18} /> Crear Nuevo
                            </button>
                        </div>

                        {isCreatingClient ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-lg">
                                <input type="text" placeholder="Nombre del nuevo cliente" required={isCreatingClient} value={newClient.nombre} onChange={(e) => setNewClient({...newClient, nombre: e.target.value})} className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <input type="text" placeholder="Contacto (opcional)" value={newClient.contacto} onChange={(e) => setNewClient({...newClient, contacto: e.target.value})} className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        ) : (
                            <select id="cliente" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} required={!isCreatingClient} className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">-- Selecciona un Cliente --</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        )}
                    </div>
                    
                    {/* Sección Añadir Productos */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">2. Añadir Productos al Carrito</label>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full md:flex-1 bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">-- Selecciona un Producto --</option>
                                {products.map(p => <option key={p.id} value={p.id} disabled={p.stock === 0}>{p.nombre} (Stock: {p.stock})</option>)}
                            </select>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} min="1" max={maxQuantity} className="w-full md:w-24 bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
                            <button type="button" onClick={handleAddItem} disabled={!selectedProduct} className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                                <Plus size={20} />
                                Añadir
                            </button>
                        </div>
                    </div>
                    
                    {/* Carrito de Compras */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Productos en la Venta</h3>
                        {saleItems.length > 0 ? (
                            saleItems.map(item => (
                                <div key={item.producto_id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{item.nombre}</p>
                                        <p className="text-sm text-gray-400">{item.cantidad} x S/ {item.precio_unitario.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold">S/ {(item.cantidad * item.precio_unitario).toFixed(2)}</p>
                                        <button type="button" onClick={() => handleRemoveItem(item.producto_id)} className="p-2 text-red-500 hover:text-red-400" title="Eliminar item">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">El carrito está vacío.</p>
                        )}
                    </div>
                </div>

                {/* Columna Derecha: Resumen y Finalizar */}
                <div className="lg:col-span-1 bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col h-fit">
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Resumen de la Venta</h2>
                    <div className="space-y-4 flex-grow">
                        <div>
                            <label htmlFor="shippingCost" className="block text-sm font-medium text-gray-300 mb-1">Costo de Envío (S/)</label>
                            <input type="number" id="shippingCost" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value) || 0)} min="0" step="0.01" className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-2 pt-4 border-t border-gray-700">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>S/ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Envío</span>
                                <span>S/ {shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-white pt-2">
                                <span>Total</span>
                                <span>S/ {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full mt-8 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-green-400 disabled:cursor-not-allowed">
                        <Save size={20} />
                        {isSubmitting ? 'Registrando...' : 'Registrar Venta'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default NewSalePage;

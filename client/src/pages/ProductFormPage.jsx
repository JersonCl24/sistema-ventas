import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../api/productService';
import { getCategories } from '../api/categoryService';
import { generateDescription } from '../api/aiService';
import toast from 'react-hot-toast';
import { Save, X, Sparkles } from 'lucide-react';

const ProductFormPage = () => {
    const [product, setProduct] = useState({
        nombre: '',
        descripcion: '',
        costo_promedio: '',
        precio_venta: '',
        stock: '',
        categoria_id: '',
        imagen_url: ''
    });
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                const cats = await getCategories();
                setCategories(cats);

                if (isEditing) {
                    const data = await getProductById(id);
                    setProduct({
                        nombre: data.nombre || '',
                        descripcion: data.descripcion || '',
                        costo_promedio: data.costo_promedio || '',
                        precio_venta: data.precio_venta || '',
                        stock: data.stock || '',
                        categoria_id: data.categoria_id || '',
                        imagen_url: data.imagen_url || ''
                    });
                }
            } catch (error) {
                toast.error("Error al cargar los datos: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleGenerateDescription = async () => {
        if (!product.nombre || !product.categoria_id) {
            toast.error('Por favor, introduce un nombre y selecciona una categoría primero.');
            return;
        }
        
        setIsGenerating(true);
        try {
            const selectedCategory = categories.find(c => c.id === parseInt(product.categoria_id));
            const response = await generateDescription(product.nombre, selectedCategory.nombre);
            
            setProduct(prev => ({ ...prev, descripcion: response.description.trim() }));
            toast.success('¡Descripción generada!');
        } catch (error) {
            toast.error(`Error al generar: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const productData = {
                ...product,
                costo_promedio: Number(product.costo_promedio),
                precio_venta: Number(product.precio_venta),
                stock: parseInt(product.stock, 10),
                categoria_id: parseInt(product.categoria_id, 10)
            };

            if (isEditing) {
                await updateProduct(id, productData);
                toast.success('Producto actualizado exitosamente');
            } else {
                await createProduct(productData);
                toast.success('Producto creado exitosamente');
            }
            navigate('/productos');
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
            <h1 className="text-3xl font-bold text-white mb-6">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h1>
            
            <form onSubmit={handleSubmit} className="bg-slate-800/50 p-8 rounded-lg border border-slate-700 shadow-lg space-y-6">
                
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-slate-300 mb-1">Nombre del producto</label>
                    <input type="text" id="nombre" name="nombre" value={product.nombre} onChange={handleChange} required className="w-full bg-slate-700/50 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
                <div>
                    <label htmlFor="imagen_url" className="block text-sm font-medium text-slate-300 mb-1">URL de la Imagen</label>
                    <input 
                        type="text" 
                        id="imagen_url" 
                        name="imagen_url" 
                        value={product.imagen_url} 
                        onChange={handleChange} 
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="w-full bg-slate-700/50 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="descripcion" className="block text-sm font-medium text-slate-300">Descripción</label>
                        <button 
                            type="button" 
                            onClick={handleGenerateDescription}
                            disabled={isGenerating}
                            className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md transition-colors disabled:bg-blue-400/50 disabled:cursor-not-allowed"
                        >
                            <Sparkles size={14} className={isGenerating ? 'animate-spin' : ''}/>
                            {isGenerating ? 'Generando...' : 'Generar con IA'}
                        </button>
                    </div>
                    <textarea id="descripcion" name="descripcion" value={product.descripcion} onChange={handleChange} rows="3" className="w-full bg-slate-700/50 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="categoria_id" className="block text-sm font-medium text-slate-300 mb-1">Categoría</label>
                        <select id="categoria_id" name="categoria_id" value={product.categoria_id} onChange={handleChange} required className="w-full bg-slate-700/50 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                            <option value="">-- Selecciona una Categoría --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-slate-300 mb-1">Stock</label>
                        <input type="number" id="stock" name="stock" value={product.stock} onChange={handleChange} required className="w-full bg-slate-700/50 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="costo_promedio" className="block text-sm font-medium text-slate-300 mb-1">Costo Promedio (S/)</label>
                        <input type="number" id="costo_promedio" name="costo_promedio" value={product.costo_promedio} onChange={handleChange} required step="0.01" className="w-full bg-slate-700/50 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                    </div>
                     <div>
                        <label htmlFor="precio_venta" className="block text-sm font-medium text-slate-300 mb-1">Precio de Venta (S/)</label>
                        <input type="number" id="precio_venta" name="precio_venta" value={product.precio_venta} onChange={handleChange} required step="0.01" className="w-full bg-slate-700/50 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                    </div>
                </div>

                <div className="pt-6 flex justify-end gap-4 border-t border-slate-700">
                    <Link to="/productos" className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <X size={20} />
                        Cancelar
                    </Link>
                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-blue-400/50 disabled:cursor-not-allowed">
                        <Save size={20} />
                        {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Guardar Producto')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;
import React, { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../api/productService';
import ProductList from '../components/products/ProductList.jsx'; // Asegúrate que la ruta sea correcta
import toast from 'react-hot-toast';
import { Search, Package } from 'lucide-react';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadProducts = useCallback(async (searchQuery) => {
        try {
            setLoading(true);
            const data = await getProducts(searchQuery);
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'No se pudieron cargar los productos');
        } finally {
            setLoading(false);
        } 
    }, []);

    useEffect(() => {
        const timerId = setTimeout(() => {
            loadProducts(searchTerm);
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchTerm, loadProducts]);

    if (error && products.length === 0) {
        return <p className="text-center p-4 text-red-500">Error: {error}</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Catálogo de Productos</h1>
            </div>
            
            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar producto por nombre..."
                    className="w-full bg-slate-800/50 text-white p-3 pl-10 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            </div>

            {loading ? (
                <div className="text-center p-8 text-slate-500">Cargando catálogo...</div>
            ) : products.length > 0 ? (
                <ProductList productos={products} />
            ) : (
                <div className="text-center p-8">
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Package size={40} />
                        <h3 className="font-semibold">No se encontraron productos</h3>
                        <p className="text-sm">No hay productos que coincidan con tu búsqueda.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default HomePage;

import React from 'react';

const ProductCard = ({ producto }) => {
    const handleImageError = (e) => {
        e.target.onerror = null; // Previene un bucle infinito si el placeholder también falla
        e.target.src = `https://placehold.co/400x400/1f2937/9ca3af?text=Imagen+no+disponible`;
    };
    return (
        <div className='bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col'>
            {/* Placeholder para la imagen del producto */}
            <div className="h-48 bg-gray-700">
                <img 
                    src={producto.imagen_url || `https://placehold.co/400x400/1f2937/9ca3af?text=${producto.nombre}`} 
                    alt={`Imagen de ${producto.nombre}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError} // <-- ¡Práctica profesional!
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs text-gray-400 uppercase font-semibold">{producto.categoria_nombre}</p>
                <h3 className="font-bold text-lg text-white mb-2 truncate flex-grow">{producto.nombre}</h3>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-semibold text-blue-400">
                        S/ {producto.precio_venta ? Number(producto.precio_venta).toFixed(2) : '0.00'}
                    </p>
                    <p className={`text-sm font-medium px-2 py-1 rounded-full ${
                        producto.stock > 20 ? 'bg-green-500/20 text-green-400' 
                        : producto.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                        {producto.stock} en stock
                    </p>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
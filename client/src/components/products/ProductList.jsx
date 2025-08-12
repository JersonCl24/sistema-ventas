
import React from 'react';
import ProductCard from './ProductCard.jsx';

const ProductList = ({ productos }) => {
    if (!productos || productos.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-400">No se encontraron productos.</p>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {productos.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
            ))}
        </div>
    );
};
export default ProductList;
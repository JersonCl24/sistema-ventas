
import db from '../database.js';

// CREAR una compra (se asigna al usuario logueado)
export const createCompras = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { proveedor_id, productos } = req.body;
        const usuario_id = req.user.id; // Obtenemos el ID del usuario

        if (!proveedor_id || !productos || productos.length === 0) {
            return res.status(400).json({ message: 'Se requiere proveedor y una lista de productos' });
        }
        
        await connection.beginTransaction();
        
        const total_compra = productos.reduce((acc, producto) => {
            return acc + (producto.cantidad * producto.costo_unitario);
        }, 0);
        
        // Añadimos la columna 'usuario_id' al INSERT
        const compraQuery = 'INSERT INTO compras (total_compra, proveedor_id, usuario_id) VALUES (?, ?, ?)';
        const [compraResult] = await connection.query(compraQuery, [total_compra, proveedor_id, usuario_id]);
        const nuevaCompraId = compraResult.insertId;
        
        for (const producto of productos) {
            const { producto_id, cantidad, costo_unitario } = producto;
            
            const detalleQuery = 'INSERT INTO detalle_compras (compra_id, producto_id, cantidad, costo_unitario) VALUES (?, ?, ?, ?)';
            await connection.query(detalleQuery, [nuevaCompraId, producto_id, cantidad, costo_unitario]);
            
            // Verificamos que el producto que se actualiza pertenezca al usuario
            const stockQuery = 'UPDATE productos SET stock = stock + ? WHERE id = ? AND usuario_id = ?';
            await connection.query(stockQuery, [cantidad, producto_id, usuario_id]);
        }
        
        await connection.commit();
        res.status(201).json({ id: nuevaCompraId, message: 'Compra creada' });
    } catch (error) {
        await connection.rollback();
        console.error('Error al crear la compra:', error);
        res.status(500).json({ message: 'Error interno del servidor para crear la compra' });
    } finally {
        connection.release();
    }
};

// LEER todas las compras (solo las del usuario logueado)
export const getCompras = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Obtenemos el ID del usuario

        // Añadimos el filtro 'WHERE c.usuario_id = ?'
        const query = `
            SELECT c.id, c.fecha, c.total_compra, p.nombre_empresa AS proveedor 
            FROM compras c 
            JOIN proveedores p ON c.proveedor_id = p.id 
            WHERE c.usuario_id = ? 
            ORDER BY c.fecha DESC
        `;
        const [compras] = await db.query(query, [usuario_id]);
        
        res.json(compras);
    } catch (error) {
        console.error('Error al obtener las compras:', error);
        res.status(500).json({ message: 'Error interno del servidor para obtener las compras' });
    }
};
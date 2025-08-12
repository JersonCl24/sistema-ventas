
import db from '../database.js';
import { registrarMovimiento } from './caja.controller.js';

export const createVentas = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { cliente_id, costo_envio, productos } = req.body;
        const usuario_id = req.user.id;

        if (!cliente_id || !productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ message: 'Cliente y una lista de productos son campos obligatorios' });
        }

        await connection.beginTransaction();

        for (const [index, producto] of productos.entries()) {
            const [rows] = await connection.query('SELECT stock, costo_promedio FROM productos WHERE id = ? AND usuario_id = ?', [producto.producto_id, usuario_id]);
            
            if (rows.length === 0) {
                await connection.rollback();
                return res.status(400).json({ message: `Producto con ID ${producto.producto_id} no encontrado o no pertenece a este usuario.` });
            }
            
            const stockDisponible = rows[0].stock;
            if (stockDisponible < producto.cantidad) {
                await connection.rollback();
                return res.status(400).json({ message: `Stock insuficiente para el producto ID ${producto.producto_id}. Disponible: ${stockDisponible}` });
            }
            producto.costo_unitario_en_venta = rows[0].costo_promedio;
        }

        const subtotal = productos.reduce((acc, producto) => acc + (producto.cantidad * producto.precio_unitario), 0);
        const total_venta = subtotal + (costo_envio || 0);

        const ventaQuery = 'INSERT INTO ventas (cliente_id, total, costo_envio, usuario_id) VALUES (?, ?, ?, ?)';
        const [ventasResult] = await connection.query(ventaQuery, [cliente_id, total_venta, costo_envio, usuario_id]);
        const nuevaVentaId = ventasResult.insertId;

        for (const [index, producto] of productos.entries()) {
            const { producto_id, cantidad, precio_unitario, costo_unitario_en_venta } = producto;
            
            const detalleQuery = 'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, costo_unitario_en_venta) VALUES (?, ?, ?, ?, ?)';
            await connection.query(detalleQuery, [nuevaVentaId, producto_id, cantidad, precio_unitario, costo_unitario_en_venta]);

            const stockQuery = 'UPDATE productos SET stock = stock - ? WHERE id = ?';
            await connection.query(stockQuery, [cantidad, producto_id]);
        }
        
        await registrarMovimiento(connection, {
            tipo: 'ingreso',
            concepto: `Venta #${nuevaVentaId}`,
            monto: total_venta,
            venta_id: nuevaVentaId,
            usuario_id: usuario_id
        });

        await connection.commit();
        res.status(201).json({ id: nuevaVentaId, message: 'Venta creada y registrada en caja.' });

    } catch (error) {
        // Este es el error que necesitamos ver en la terminal
        console.error(error); 
        await connection.rollback();
        res.status(500).json({ message: 'Error interno del servidor para crear la venta. Revisa la consola del backend.' });
    } finally {
        connection.release();
    }
};

// LEER ventas (solo las del usuario logueado)
export const getVentas = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { search } = req.query;

        let query = `
            SELECT 
                v.id, 
                v.fecha, 
                v.total, 
                v.estado,
                COALESCE(c.nombre, 'Cliente Eliminado') AS cliente 
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE v.usuario_id = ?
        `;
        const params = [usuario_id];

        if (search) {
            const searchId = parseInt(search, 10);
            if (!isNaN(searchId)) {
                query += ' AND (c.nombre LIKE ? OR v.id = ?)';
                params.push(`%${search}%`, searchId);
            } else {
                query += ' AND c.nombre LIKE ?';
                params.push(`%${search}%`);
            }
        }
        
        query += ' ORDER BY v.fecha DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);

    } catch (error) {
        console.error('Error detallado al obtener las ventas:', error);
        return res.status(500).json({ message: 'Algo salió mal al obtener las ventas.' });
    }
};


// OBTENER una venta por ID (solo si pertenece al usuario logueado)
export const getVentasById = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    try {
        const ventaQuery = `
            SELECT v.id, v.fecha, v.total, v.estado, v.costo_envio, c.nombre AS cliente
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE v.id = ? AND v.usuario_id = ?;
        `;
        const [ventaRows] = await db.query(ventaQuery, [id, usuario_id]);

        if (ventaRows.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada o no tienes permiso para verla.' });
        }

        const detallesQuery = `
            SELECT dv.cantidad, dv.precio_unitario, p.nombre AS producto_nombre
            FROM detalle_ventas dv
            JOIN productos p ON dv.producto_id = p.id
            WHERE dv.venta_id = ?;
        `;
        const [detallesRows] = await db.query(detallesQuery, [id]);

        const ventaCompleta = {
            ...ventaRows[0],
            detalles: detallesRows
        };

        res.json(ventaCompleta);

    } catch (error) {
        console.error('Error al obtener el detalle de la venta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// ACTUALIZAR el estado de una venta (solo si pertenece al usuario logueado)
export const updateVentaStatus = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    const validosEstados = ['Pendiente', 'Pagado', 'Enviado', 'Completado', 'Cancelado'];
    if (!estado || !validosEstados.includes(estado)) {
        return res.status(400).json({ message: 'Se requiere un estado válido.' });
    }

    try {
        // Añadimos 'AND usuario_id = ?' para seguridad
        const query = 'UPDATE ventas SET estado = ? WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [estado, id, usuario_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Venta no encontrada o no tienes permiso para editarla.' });
        }

        res.json({ message: `El estado de la venta ha sido actualizado a "${estado}".` });

    } catch (error) {
        console.error('Error al actualizar el estado de la venta:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
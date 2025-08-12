import db from '../database.js';

// LEER productos (solo los del usuario logueado)
export const getProductos = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Obtenemos el ID del usuario desde el token
        const { search } = req.query;
        
        let query = `
            SELECT 
                p.id, 
                p.nombre, 
                p.descripcion, 
                p.costo_promedio, 
                p.precio_venta, 
                p.stock, 
                p.categoria_id,
                c.nombre AS categoria_nombre,
                p.imagen_url
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.usuario_id = ?`; // <-- FILTRO PRINCIPAL POR USUARIO
        
        const params = [usuario_id];
    
        if (search) {
            query += ' AND p.nombre LIKE ?'; // El filtro de búsqueda se añade después
            params.push(`%${search}%`); // Corregido: solo un parámetro
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error interno del servidor para obtener los productos' });
    }
};

// CREAR un producto (se asigna al usuario logueado)
export const createProductos = async (req, res) => {
    const { nombre, descripcion, costo_promedio, precio_venta, stock, categoria_id, imagen_url } = req.body;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    if (!nombre || !costo_promedio || !precio_venta) {
        return res.status(400).json({ message: 'El nombre, costo promedio y precio de venta son datos obligatorios' });
    }
    try {
        // Añadimos la columna 'usuario_id' al INSERT
        const query = 'INSERT INTO productos (nombre, descripcion, costo_promedio, precio_venta, stock, categoria_id, usuario_id, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [nombre, descripcion, costo_promedio, precio_venta, stock, categoria_id, usuario_id, imagen_url]);
        
        res.status(201).json({ id: result.insertId, message: 'Producto creado' });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor para crear el producto' });
    }
};

// ACTUALIZAR un producto (solo si pertenece al usuario logueado)
export const updateProductos = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, costo_promedio, precio_venta, stock, categoria_id, imagen_url } = req.body;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    if (!nombre || !costo_promedio || !precio_venta) {
        return res.status(400).json({ message: 'Nombre, costo promedio y precio de venta son datos obligatorios' });
    }
    try {
        // Añadimos 'AND usuario_id = ?' para seguridad
        const query = 'UPDATE productos SET nombre = ?, descripcion = ?, costo_promedio = ?, precio_venta = ?, stock = ?, categoria_id = ?, imagen_url = ? WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [nombre, descripcion, costo_promedio, precio_venta, stock, categoria_id, imagen_url, id, usuario_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado o no tienes permiso para editarlo.' });
        }
        res.status(200).json({ id: id, message: 'Producto actualizado' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor para actualizar el producto' });
    }
};

// BORRAR un producto (solo si pertenece al usuario logueado)
export const deleteProductos = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    try {
        // Añadimos 'AND usuario_id = ?' para seguridad
        const query = 'DELETE FROM productos WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [id, usuario_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado o no tienes permiso para eliminarlo.' });
        }
        res.status(200).json({ id: id, message: 'Producto borrado' });
    } catch (error) {
        console.error('Error al borrar el producto:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede borrar el producto porque esta asociado a una venta o compra' });
        }
        res.status(500).json({ message: 'Error interno del servidor para borrar el producto' });
    }
};

// OBTENER un producto por ID (solo si pertenece al usuario logueado)
export const getProductoById = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    try {
        // Añadimos 'AND p.usuario_id = ?' para seguridad
        const [rows] = await db.query(`
            SELECT 
                p.id, p.nombre, p.descripcion, p.costo_promedio, p.precio_venta, p.stock, p.categoria_id,
                c.nombre AS categoria_nombre 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = ? AND p.usuario_id = ?
        `, [id, usuario_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
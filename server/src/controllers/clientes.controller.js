
import db from '../database.js';

// LEER clientes (solo los del usuario logueado)
export const getClientes = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Obtenemos el ID del usuario
        const { search } = req.query;
        
        let query = `
            SELECT 
                c.id, 
                c.nombre, 
                c.contacto, 
                c.fecha_registro
            FROM clientes c
            WHERE c.usuario_id = ?`; // <-- FILTRO PRINCIPAL POR USUARIO
            
        const params = [usuario_id];
    
        if (search) {
            query += ' AND c.nombre LIKE ?';
            params.push(`%${search}%`);
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch(error){
        console.error('Error al obtener los clientes:', error);
        res.status(500).json({message: 'Error interno del servidor para obtener los clientes'});
    }
};

// LEER un cliente específico (solo si pertenece al usuario logueado)
export const getClienteById = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    try {
        // Añadimos 'AND usuario_id = ?' para seguridad
        const [rows] = await db.query('SELECT * FROM clientes WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        // Tu código original devolvía un array, lo correcto es devolver un solo objeto
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor para obtener el cliente' });
    }
};

// CREAR un cliente (se asigna al usuario logueado)
export const createClientes = async (req, res) => {
    const { nombre, contacto } = req.body;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es un campo obligatorio' });
    }
    try {
        // Añadimos la columna 'usuario_id' al INSERT
        const query = 'INSERT INTO clientes (nombre, contacto, usuario_id) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [nombre, contacto, usuario_id]);
        
        res.status(201).json({ id: result.insertId, message: 'Cliente creado' });
    } catch (error) {
        console.error('Error al crear el cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor para crear el cliente' });
    }
};

// ACTUALIZAR un cliente (solo si pertenece al usuario logueado)
export const updateClientes = async (req, res) => {
    const { id } = req.params;
    const { nombre, contacto } = req.body;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es un campo obligatorio' });
    }
    try {
        // Añadimos 'AND usuario_id = ?' para seguridad
        const query = 'UPDATE clientes SET nombre = ?, contacto = ? WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [nombre, contacto, id, usuario_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado o no tienes permiso para editarlo.' });
        }
        res.status(200).json({ id: id, message: 'Cliente actualizado' });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor para actualizar el cliente' });
    }
};

// BORRAR un cliente (solo si pertenece al usuario logueado)
export const deleteClientes = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    try {
        // Añadimos 'AND usuario_id = ?' para seguridad
        const query = 'DELETE FROM clientes WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [id, usuario_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado o no tienes permiso para eliminarlo.' });
        }
        res.status(200).json({ id: id, message: 'Cliente borrado' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede borrar el cliente porque tiene registros asociados' });
        }
        console.error('Error al borrar el cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor para borrar el cliente' });
    }
};
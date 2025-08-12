
import db from '../database.js';

// LEER categorías (solo las del usuario logueado)
export const getCategorias = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Obtenemos el ID del usuario
        const { search } = req.query;
        
        let query = 'SELECT * FROM categorias WHERE usuario_id = ?'; // <-- FILTRO PRINCIPAL POR USUARIO
        const params = [usuario_id];

        if (search) {
            query += ' AND nombre LIKE ?';
            params.push(`%${search}%`);
        }
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch(error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({message: 'Error interno del servidor para obtener las categorías'});
    }
};

// CREAR una categoría (se asigna al usuario logueado)
export const createCategorias = async (req, res) => {
    const { nombre } = req.body;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es un campo obligatorio' });
    }
    try {
        // Añadimos la columna 'usuario_id' al INSERT
        const query = 'INSERT INTO categorias (nombre, usuario_id) VALUES (?, ?)';
        const [result] = await db.query(query, [nombre, usuario_id]);
        
        res.status(201).json({ id: result.insertId, message: 'Categoría creada' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'La categoría ya existe' });
        }
        console.error('Error al crear la categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor para crear la categoría' });
    }
};

// ACTUALIZAR una categoría (solo si pertenece al usuario logueado)
export const updateCategorias = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es un campo obligatorio' });
    }
    try {
        // Añadimos 'AND usuario_id = ?' para seguridad
        const query = 'UPDATE categorias SET nombre = ? WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [nombre, id, usuario_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada o no tienes permiso para editarla.' });
        }
        res.status(200).json({ id: id, message: 'Categoría actualizada' });
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor para actualizar la categoría' });
    }
};

// BORRAR una categoría (solo si pertenece al usuario logueado)
export const deleteCategorias = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    try {
        // Añadimos 'AND usuario_id = ?' para seguridad
        const query = 'DELETE FROM categorias WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [id, usuario_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada o no tienes permiso para eliminarla.' });
        }
        res.status(200).json({ id: id, message: 'Categoría borrada' });
    } catch (error) {
        console.error('Error al borrar la categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor para borrar la categoría' });
    }
};

// OBTENER una categoría por ID (solo si pertenece al usuario logueado)
export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    try {
        // Añadimos 'AND usuario_id = ?' para seguridad
        const [rows] = await db.query('SELECT * FROM categorias WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la Categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
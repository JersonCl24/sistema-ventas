
import db from '../database.js';

// LEER proveedores (solo los del usuario logueado)
export const getProveedores = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Obtenemos el ID del usuario
        const { search } = req.query;
        
        let query = `
            SELECT 
                p.id, 
                p.nombre_empresa, 
                p.contacto_nombre, 
                p.telefono, 
                p.email
            FROM proveedores p
            WHERE p.usuario_id = ?`; // <-- FILTRO PRINCIPAL POR USUARIO
        
        const params = [usuario_id];
    
        if (search) {
            query += ' AND p.nombre_empresa LIKE ?';
            params.push(`%${search}%`); 
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch(error){
        console.error('Error al obtener los proveedores:', error);
        res.status(500).json({message: 'Error interno del servidor para obtener los proveedores'});
    }
};

// CREAR un proveedor (se asigna al usuario logueado)
export const createProveedores = async(req,res) => {
    const {nombre_empresa, contacto_nombre, telefono, email} = req.body;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    if(!nombre_empresa){
        return res.status(400).json({message: 'El nombre de la empresa es un campo obligatorio'});
    }
    try{
        // Añadimos la columna 'usuario_id' al INSERT
        const query = 'INSERT INTO proveedores (nombre_empresa, contacto_nombre, telefono, email, usuario_id) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [nombre_empresa, contacto_nombre, telefono, email, usuario_id]);
        
        res.status(201).json({id: result.insertId, message: 'Proveedor creado'});
    }catch(error){
        console.error('Error al crear el proveedor:', error);
        res.status(500).json({message: 'Error interno del servidor para crear el proveedor'});
    }
};

// ACTUALIZAR un proveedor (solo si pertenece al usuario logueado)
export const updateProveedores = async (req,res) =>{
    const {id} = req.params;
    const {nombre_empresa, contacto_nombre, telefono, email} = req.body;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    if(!nombre_empresa){
        return res.status(400).json({message: 'El nombre de la empresa es un campo obligatorio'});
    }
    try{
        // Añadimos 'AND usuario_id = ?' para seguridad
        const query = 'UPDATE proveedores SET nombre_empresa = ?, contacto_nombre = ?, telefono = ?, email = ? WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [nombre_empresa, contacto_nombre, telefono, email, id, usuario_id]);
        
        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Proveedor no encontrado o no tienes permiso para editarlo.'});
        }
        res.status(200).json({id: id, message: 'Proveedor actualizado'});
    }catch(error){
        console.error('Error al actualizar el proveedor:', error);
        res.status(500).json({message: 'Error interno del servidor para actualizar el proveedor'});
    }
};

// BORRAR un proveedor (solo si pertenece al usuario logueado)
export const deleteProveedores = async (req, res) =>{
    const {id} = req.params;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    try{
        // Añadimos 'AND usuario_id = ?' para seguridad
        const query = 'DELETE FROM proveedores WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [id, usuario_id]);

        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Proveedor no encontrado o no tienes permiso para eliminarlo.'});
        }
        res.status(200).json({id: id, message: 'Proveedor borrado'});
    }catch(error){
        if(error.code === 'ER_ROW_IS_REFERENCED_2'){
            return res.status(400).json({message: 'No se puede borrar el proveedor porque tiene compras asociadas'});
        }
        console.error('Error al borrar el proveedor:', error);
        res.status(500).json({message: 'Error interno del servidor para borrar el proveedor'});
    }
};

// OBTENER un proveedor por ID (solo si pertenece al usuario logueado)
export const getProveedoresById = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id; // Obtenemos el ID del usuario

    try {
        // Añadimos 'AND usuario_id = ?' para seguridad
        const [rows] = await db.query('SELECT * FROM proveedores WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
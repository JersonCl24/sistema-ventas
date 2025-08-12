
import db from '../database.js';
import { registrarMovimiento } from './caja.controller.js';

// LEER gastos (solo los del usuario logueado)
export const getGastos = async(req, res) => {
    try {
        const usuario_id = req.user.id;
        const { search } = req.query;
        
        let query = `
            SELECT 
                g.id, 
                g.descripcion, 
                g.monto, 
                g.fecha, 
                g.categoria_gasto
            FROM gastos g
            WHERE g.usuario_id = ?`;
            
        const params = [usuario_id];
        
        if (search) {
            query += ' AND g.descripcion LIKE ?';
            params.push(`%${search}%`);
        }
        
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch(error){
        console.error('Error al obtener los gastos:', error);
        res.status(500).json({message: 'Error interno del servidor para obtener los gastos'});
    }
};

// CREAR un gasto (con transacción)
export const createGastos = async(req, res) => {
    const connection = await db.getConnection(); // Obtenemos una conexión para la transacción
    try {
        const {descripcion, monto, fecha, categoria_gasto} = req.body;
        const usuario_id = req.user.id;

        if(!descripcion || !monto || !fecha){
            return res.status(400).json({message: 'La descripción, monto y fecha son campos obligatorios'});
        }

        await connection.beginTransaction(); // <-- 1. INICIAMOS LA TRANSACCIÓN

        const query = 'INSERT INTO gastos (descripcion, monto, fecha, categoria_gasto, usuario_id) VALUES (?,?,?,?,?)';
        const [result] = await connection.query (query, [descripcion, monto, fecha, categoria_gasto, usuario_id]);
        const gastoId = result.insertId; // <-- 2. Usamos la variable correcta

        // 3. Registramos el egreso en la caja DENTRO de la misma transacción
        await registrarMovimiento(connection, {
            tipo: 'egreso',
            concepto: `Gasto: ${descripcion}`,
            monto: -parseFloat(monto),
            gasto_id: gastoId,
            usuario_id: usuario_id
        });

        await connection.commit(); // <-- 4. Si todo fue bien, confirmamos los cambios

        // 5. Enviamos UNA SOLA respuesta al final
        res.status(201).json({ id: gastoId, message: 'Gasto creado y registrado en caja.' });

    } catch(error) {
        await connection.rollback(); // <-- 6. Si algo falla, revertimos TODO
        console.error('Error al crear el gasto:', error);
        res.status(500).json({message: 'Error interno del servidor para crear el gasto'});
    } finally {
        connection.release(); // <-- 7. Liberamos la conexión
    }
};

// ACTUALIZAR un gasto (solo si pertenece al usuario logueado)
export const updateGastos = async (req, res) => {
    const {id} = req.params;
    const {descripcion, monto, fecha, categoria_gasto} = req.body;
    const usuario_id = req.user.id;

    if(!descripcion || !monto || !fecha){
        return res.status(400).json({message: 'La descripción, monto y fecha son campos obligatorios'});
    }
    try{
        const query = 'UPDATE gastos SET descripcion = ?, monto = ?, fecha = ? , categoria_gasto = ? WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [descripcion, monto, fecha, categoria_gasto, id, usuario_id]);
        
        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Gasto no encontrado o no tienes permiso para editarlo.'});
        }
        res.status(200).json({id: id, message: 'Gasto actualizado'});
    }catch(error){
        console.error('Error al actualizar el gasto:', error);
        res.status(500).json({message: 'Error interno del servidor para actualizar el gasto'});
    }
};

// BORRAR un gasto (solo si pertenece al usuario logueado)
export const deleteGastos = async (req, res) => {
    // Nota: Borrar un gasto debería generar un movimiento de caja de 'ajuste' para revertir el egreso.
    // Esto es una mejora futura, por ahora solo lo eliminamos.
    const {id} = req.params;
    const usuario_id = req.user.id;

    try{
        const query = 'DELETE FROM gastos WHERE id = ? AND usuario_id = ?';
        const [result] = await db.query(query, [id, usuario_id]);

        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Gasto no encontrado o no tienes permiso para eliminarlo.'});
        }
        res.status(200).json({id: id, message: 'Gasto borrado'});
    }catch(error){
        if(error.code === 'ER_ROW_IS_REFERENCED_2'){
            return res.status(400).json({message: 'No se puede borrar el gasto porque tiene registros asociados'});
        }
        console.error('Error al borrar el gasto:', error);
        res.status(500).json({message: 'Error interno del servidor para borrar el gasto'});
    }
};

// OBTENER un gasto por ID (solo si pertenece al usuario logueado)
export const getGastoById = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id;

    try {
        const [rows] = await db.query('SELECT * FROM gastos WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Gasto no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el gasto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
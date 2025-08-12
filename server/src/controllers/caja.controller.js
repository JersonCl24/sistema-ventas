import db from '../database.js';

// Función interna (helper) para obtener el último saldo DE UN USUARIO ESPECÍFICO
const getLatestBalance = async (connection, usuario_id) => {
    const [rows] = await connection.query(
        'SELECT saldo_resultante FROM movimientos_caja WHERE usuario_id = ? ORDER BY id DESC LIMIT 1', 
        [usuario_id]
    );
    return rows.length > 0 ? parseFloat(rows[0].saldo_resultante) : 0;
};

export const registrarMovimiento = async (connection, { tipo, concepto, monto, usuario_id, venta_id = null, gasto_id = null }) => {
    try {
        const ultimoSaldo = await getLatestBalance(connection, usuario_id);
        const nuevoSaldo = ultimoSaldo + monto;

        await connection.query(
            'INSERT INTO movimientos_caja (tipo, concepto, monto, saldo_resultante, venta_id, gasto_id, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [tipo, concepto, monto, nuevoSaldo, venta_id, gasto_id, usuario_id]
        );
    } catch (error) {
        console.error("Error al registrar movimiento de caja:", error);
        throw error;
    }
};

// --- Endpoints para el Frontend ---

// Obtener el saldo actual (solo del usuario logueado)
export const getSaldoActual = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const saldo = await getLatestBalance(db, usuario_id);
        res.json({ saldo_actual: saldo });
    } catch (error) {
        console.error("Error en getSaldoActual:", error);
        res.status(500).json({ message: 'Error al obtener el saldo de la caja.' });
    }
};

// Obtener el historial de movimientos (solo del usuario logueado)
export const getMovimientos = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const [rows] = await db.query('SELECT * FROM movimientos_caja WHERE usuario_id = ? ORDER BY id DESC', [usuario_id]);
        res.json(rows);
    } catch (error) {
        console.error("Error en getMovimientos:", error);
        res.status(500).json({ message: 'Error al obtener los movimientos de caja.' });
    }
};

// Crear un ajuste manual de caja (este SÍ maneja su propia transacción)
export const createAjuste = async (req, res) => {
    const { concepto, monto } = req.body;
    const usuario_id = req.user.id;
    const connection = await db.getConnection(); // Obtenemos una conexión para manejar la transacción

    if (!concepto || monto === undefined) {
        return res.status(400).json({ message: 'Concepto y monto son requeridos.' });
    }
    try {
        await connection.beginTransaction();
        // Llamamos a nuestra función ayudante, pasándole la conexión
        await registrarMovimiento(connection, {
            tipo: 'ajuste',
            concepto,
            monto: parseFloat(monto),
            usuario_id
        });
        await connection.commit();
        res.status(201).json({ message: 'Ajuste de caja registrado exitosamente.' });
    } catch (error) {
        await connection.rollback();
        console.error("Error en createAjuste:", error);
        res.status(500).json({ message: 'Error al registrar el ajuste de caja.' });
    } finally {
        connection.release();
    }
};


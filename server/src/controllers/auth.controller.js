
import db from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// REGISTRAR un nuevo usuario
export const register = async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const query = 'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [nombre, email, password_hash]);

        const payload = { id: result.insertId, nombre: nombre, email: email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// INICIAR SESIÓN de un usuario
export const login = async (req, res) => {
    const { email, password } = req.body; // <-- Cambiado a email
    if (!email || !password) {
        return res.status(400).json({ message: 'Se requiere email y contraseña.' });
    }
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]); // <-- Cambiado a email
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const payload = { id: user.id, nombre: user.nombre, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next) => {
    // 1. Obtenemos el token del encabezado de la petición
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ message: 'No hay token, autorización denegada.' });
    }

    // El token usualmente viene en el formato "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    // 2. Verificamos el token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Si el token ha expirado o es inválido
            return res.status(403).json({ message: 'Token inválido o expirado.' });
        }

        // 3. Si el token es válido, guardamos los datos del usuario en 'req'
        req.user = user;

        // 4. 'next()' permite que la petición continúe hacia el controlador
        next();
    });
};
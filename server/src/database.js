import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); //cargamos las variables de entorno

//Creamos un pool de conexiones. Es mas eficiente que crear una conexion por cada consulta
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
console.log('Conexión a la base de datos establecida');

export default pool;

// 1. Importaciones: Usamos la sintaxis moderna de ES Modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productosRoutes from './routes/productos.routes.js'; // Importamos las rutas de productos
import clientesRoutes from './routes/clientes.routes.js'; // Importamos las rutas de clientes
import proveedoresRoutes from './routes/proveedores.routes.js'; // Importamos las rutas de proveedores
import gastosRoutes from './routes/gastos.routes.js'; // Importamos las rutas de gastos
import categoriasRoutes from './routes/categorias.routes.js'; // Importamos las rutas de categorías
import comprasRoutes from './routes/compras.routes.js'; // Importamos las rutas de compras
import ventasRoutes from './routes/ventas.routes.js'; // Importamos las rutas de ventas
import dashboardRoutes from './routes/dashboard.routes.js'; // <-- 1. Importa las rutas del dashboard
import authRoutes from './routes/auth.routes.js'; // Importamos las rutas de autenticación
import financialsRoutes from './routes/financials.routes.js'; // <-- AÑADIR ESTA LÍNEA
import aiRoutes from './routes/ai.routes.js'; // <-- AÑADIR ESTA LÍNEA
import cajaRoutes from './routes/caja.routes.js'; // <-- AÑADIR
// Configuramos dotenv para manejar variables de entorno
dotenv.config();
// 2. Inicialización: Creamos una instancia de nuestra aplicación Express
const app = express();
// 3. Configuración: Definimos el puerto en el que correrá el servidor
// Usamos el 4000 para no chocar con el puerto de React (que suele ser 3000 o 5173)
const PORT = process.env.PORT || 3000;
// 4. Middlewares: Plugins que se ejecutan en cada petición
// Habilitamos CORS para permitir que el frontend haga peticiones
app.use(cors());
app.use(express.json()); // Permite que Express entienda JSON en las peticiones
//5. Rutas de productos
app.use('/api/auth', authRoutes); // Le decimos a nuestra aplicación que use las rutas de autenticación
app.use('/api/productos', productosRoutes); // Le decimos a nuestra aplicación que use las rutas de productos
app.use('/api/ai', aiRoutes);
app.use('/api/clientes', clientesRoutes); // Le decimos a nuestra aplicación que use las rutas de clientes
app.use('/api/proveedores', proveedoresRoutes); // Le decimos a nuestra aplicación que use las rutas de proveedores
app.use('/api/gastos', gastosRoutes); // Le decimos a nuestra aplicación que use las rutas de gastos
app.use('/api/categorias', categoriasRoutes); // Le decimos a nuestra aplicación que use las rutas de categorías
app.use('/api/compras', comprasRoutes); // Le decimos a nuestra aplicación que use las rutas de compras
app.use('/api/ventas', ventasRoutes); // Le decimos a nuestra aplicación que use las rutas de ventas
app.use('/api/dashboard', dashboardRoutes); // <-- 2. Registra las nuevas rutas
app.use('/api/financials', financialsRoutes); // <-- AÑADIR ESTA LÍNEA
app.use('/api/caja', cajaRoutes); // <-- AÑADIR ESTA LÍNEA

//6. Levantar el Servidor: Ponemos nuestra aplicación a escuchar peticiones
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

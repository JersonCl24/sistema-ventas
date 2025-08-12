// 1. Importaciones: Usamos la sintaxis moderna de ES Modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productosRoutes from './routes/productos.routes.js'; 
import clientesRoutes from './routes/clientes.routes.js'; 
import proveedoresRoutes from './routes/proveedores.routes.js'; 
import gastosRoutes from './routes/gastos.routes.js'; 
import categoriasRoutes from './routes/categorias.routes.js'; 
import comprasRoutes from './routes/compras.routes.js'; 
import ventasRoutes from './routes/ventas.routes.js'; 
import dashboardRoutes from './routes/dashboard.routes.js'; 
import authRoutes from './routes/auth.routes.js'; 
import financialsRoutes from './routes/financials.routes.js'; 
import aiRoutes from './routes/ai.routes.js'; 
import cajaRoutes from './routes/caja.routes.js'; 
// Configuramos dotenv para manejar variables de entorno
dotenv.config();
// 2. Inicialización: Creamos una instancia de nuestra aplicación Express
const app = express();
// 3. Configuración: Definimos el puerto en el que correrá el servidor
const PORT = process.env.PORT || 3000;
// Habilitamos CORS para permitir que el frontend haga peticiones
app.use(cors());
app.use(express.json()); 
//5. Rutas de productos
app.use('/api/auth', authRoutes); 
app.use('/api/productos', productosRoutes); 
app.use('/api/ai', aiRoutes);
app.use('/api/clientes', clientesRoutes); 
app.use('/api/proveedores', proveedoresRoutes); 
app.use('/api/gastos', gastosRoutes); 
app.use('/api/categorias', categoriasRoutes); 
app.use('/api/compras', comprasRoutes); 
app.use('/api/ventas', ventasRoutes); 
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/financials', financialsRoutes); 
app.use('/api/caja', cajaRoutes); 

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

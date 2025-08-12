import {Router} from 'express';
import {createVentas, getVentas, getVentasById, updateVentaStatus} from '../controllers/ventas.controller.js';
import {authRequired} from '../middlewares/auth.middleware.js';
const router = Router();

//Rutas para crear una venta
router.post('/',authRequired, createVentas);
//Rutas para obtener todas las ventas   
router.get('/', authRequired,getVentas);
router.get('/:id', authRequired,getVentasById);
router.patch('/:id/estado', authRequired,updateVentaStatus);

export default router;
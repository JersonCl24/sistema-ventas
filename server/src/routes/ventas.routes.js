import {Router} from 'express';
import {createVentas, getVentas, getVentasById, updateVentaStatus} from '../controllers/ventas.controller.js';
import {authRequired} from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/',authRequired, createVentas);
router.get('/', authRequired,getVentas);
router.get('/:id', authRequired,getVentasById);
router.patch('/:id/estado', authRequired,updateVentaStatus);

export default router;
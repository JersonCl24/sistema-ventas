import { Router } from 'express';
import { getSaldoActual, getMovimientos, createAjuste } from '../controllers/caja.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authRequired);

router.get('/saldo', getSaldoActual);
router.get('/movimientos', getMovimientos);
router.post('/ajuste', createAjuste);

export default router;
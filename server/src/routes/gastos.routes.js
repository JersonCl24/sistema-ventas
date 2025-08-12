import { Router } from "express";
import { getGastos, createGastos, updateGastos, deleteGastos, getGastoById } from '../controllers/gastos.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/', authRequired,getGastos);
router.post('/',authRequired, createGastos);
router.put('/:id',authRequired, updateGastos);
router.delete('/:id',authRequired, deleteGastos);
router.get('/:id',authRequired, getGastoById)
export default router;
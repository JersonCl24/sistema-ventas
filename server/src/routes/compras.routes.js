import { Router } from "express";
import { createCompras, getCompras } from '../controllers/compras.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/',authRequired, createCompras);
router.get('/', authRequired,getCompras);

export default router;

import { Router } from 'express';
import { generateProductDescription } from '../controllers/ai.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js'; // Protegemos el endpoint

const router = Router();

// Todas las rutas de IA requerirán autenticación
router.use(authRequired);

router.post('/generate-description', generateProductDescription);

export default router;

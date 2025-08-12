import { Router } from 'express';
import { 
    getProveedores, 
    createProveedores, 
    updateProveedores, 
    deleteProveedores, 
    getProveedoresById 
} from '../controllers/proveedores.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplicamos el middleware de autenticación a todas las rutas de proveedores
router.use(authRequired);

router.get('/', getProveedores);
router.post('/', createProveedores);
router.get('/:id', getProveedoresById);
router.put('/:id', updateProveedores); 
router.delete('/:id', deleteProveedores);

export default router;

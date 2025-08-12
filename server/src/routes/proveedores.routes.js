import { Router } from 'express';
import { 
    getProveedores, 
    createProveedores, 
    updateProveedores, 
    deleteProveedores, 
    getProveedoresById 
} from '../controllers/proveedores.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js'; // Asegúrate que la ruta sea correcta

const router = Router();

// Aplicamos el middleware de autenticación a todas las rutas de proveedores
router.use(authRequired);

router.get('/', getProveedores);
router.post('/', createProveedores);
router.get('/:id', getProveedoresById);
router.put('/:id', updateProveedores); // <-- ESTA ES LA RUTA QUE RESUELVE EL ERROR 404
router.delete('/:id', deleteProveedores);

export default router;

import { Router } from "express";
// Importamos los controladores de nuestra aplicacion
import { getCategorias, createCategorias, updateCategorias, deleteCategorias, getCategoryById } from '../controllers/categorias.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
const router = Router();

// Definimos las rutas y que controladores responderán
router.get('/', authRequired,getCategorias);
router.post('/', authRequired,createCategorias);
router.put('/:id',authRequired, updateCategorias);
router.delete('/:id', authRequired,deleteCategorias); 
router.get('/:id',authRequired, getCategoryById);
export default router;
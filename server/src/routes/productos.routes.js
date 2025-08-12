import { Router } from "express";
//Importamos los controladores de nuestra aplicacion
import {getProductos, getProductoById ,createProductos, updateProductos, deleteProductos} from '../controllers/productos.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
const router = Router();

//Definimos las rutas y que controladores responderán
router.get('/', authRequired,getProductos);
router.post('/',authRequired, createProductos);
router.get('/:id', authRequired,getProductoById);
router.put('/:id',authRequired, updateProductos);
router.delete('/:id',authRequired, deleteProductos);

export default router;
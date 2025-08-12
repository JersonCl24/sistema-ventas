import { Router} from 'express';
//Importamos los controladores de nuestra aplicacion
import {getClientes, getClienteById, createClientes, updateClientes, deleteClientes} from '../controllers/clientes.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
const router = Router();

//Definimos las rutas y que controladores responderán
router.get('/',authRequired, getClientes);
router.get('/:id',authRequired, getClienteById);
router.post('/',authRequired, createClientes);
router.put('/:id',authRequired, updateClientes);
router.delete('/:id',authRequired, deleteClientes);

export default router;
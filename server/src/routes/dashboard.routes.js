import { Router } from 'express';
import { getDashboardSummary, getSalesOverTime } from '../controllers/dashboard.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/summary', authRequired,getDashboardSummary);
router.get('/sales-over-time',authRequired, getSalesOverTime);

export default router;

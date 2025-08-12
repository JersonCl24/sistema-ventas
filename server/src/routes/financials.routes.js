import { Router } from 'express';
import { getFinancialBreakdown, getFinancialSummary } from '../controllers/financials.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authRequired);
router.get('/summary', getFinancialSummary);
router.get('/breakdown', getFinancialBreakdown);
export default router;
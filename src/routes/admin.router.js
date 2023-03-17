import express from 'express';
import AdminController from '../controllers/admin.controller.js';
import checkAuth from '../middlewares/check-auth.js';

const router = express.Router();
const controller = new AdminController();

router.use(checkAuth);
router.get('/dashboard/summaryInformation',controller.summaryInformation);
router.get('/dashboard/summaryDetailInformation',controller.summaryDetailInformation);
router.get('/dashboard/salesStatus',controller.getSalesStatus);
router.get('/dashboard/productStatus',controller.getProductStatus);
router.get('/dashboard/categoryStatus',controller.getCategoryStatus);
router.get('/dashboard/relationTransactionUsers',controller.getRelationBetweenTransactionAndUser);
router.get('/dashboard/lastCurrentCategoryProduct',controller.getDashboardLastAndCurrentCategoryProduct);

export default router;
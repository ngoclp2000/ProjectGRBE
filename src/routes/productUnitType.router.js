import express from 'express';
import ProductUnitTypeController from '../controllers/productUnitType.controller.js';
import checkAuth from '../middlewares/check-auth.js';

const router = express.Router();
const controller = new ProductUnitTypeController();

router.use(checkAuth);
router.post('/combobox',controller.getDataCombobox);

export default router;
import express from 'express';
import ShippingSupplyController from '../controllers/shippingSupply.controller.js';
import checkAuth from '../middlewares/check-auth.js';

const router = express.Router();
const controller = new ShippingSupplyController();

router.use(checkAuth);
router.post('/combobox',controller.getDataCombobox);

export default router;
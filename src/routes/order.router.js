import express from 'express';
import checkAuth from '../middlewares/check-auth.js';
import OrderController from '../controllers/order.controller.js';
import {baseRoute}  from './base.router.js';
const router = express.Router();
const controller = new OrderController();

router.use(checkAuth);
baseRoute(router,controller);
router.post('/takePayment',controller.takePayment);
router.get('/getDiscount',controller.getDiscount);

export default router;
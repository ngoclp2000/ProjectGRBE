import express from 'express';
const router = express.Router();
import checkAuth from '../middlewares/check-auth.js';
import {baseRoute}  from './base.router.js';
import ProductController from '../controllers/product.controller.js';
const controller = new ProductController();

router.use(checkAuth);
baseRoute(router,controller);
router.post('/dataProductList',controller.getProductList);
router.get('/productManage', controller.getProductManage);

router.get('/:productId', controller.getProductById);


export default router;

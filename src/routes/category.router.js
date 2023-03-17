//const checkAuth = require("../middlewares/check-auth");

import express from 'express';
import CategoryController from '../controllers/category.controller.js';
import checkAuth from '../middlewares/check-auth.js';

const router = express.Router();

const controller = new CategoryController();

router.use(checkAuth);

router.post('/combobox',controller.getDataCombobox);

export default router;
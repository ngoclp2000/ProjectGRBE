import express from 'express';
import AccountController from '../controllers/account.controller.js';

const controller = new AccountController();

const router = express.Router();

router.post('/signUp', controller.signUp);
router.post('/completeProfile', controller.completeProfile);
router.post("/signIn", controller.signIn);

export default router;
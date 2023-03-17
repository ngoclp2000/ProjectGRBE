
import express from 'express';
import AuthController from '../controllers/auth.controller.js';

const router = express.Router();
const controller = new AuthController();


router.post('/refresh-token', controller.refreshToken);
router.post('/remove-token', controller.removeToken);


export default router;

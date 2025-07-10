import express from 'express';
import * as userController from '../../controllers/user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

// This is a protected route. You must provide a valid token to access it.
router.get('/profile', protect, userController.getProfile);

export default router;

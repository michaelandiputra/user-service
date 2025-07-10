import express from 'express';
import * as userController from '../../controllers/user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes for profile
router.route('/profile')
  .get(protect, userController.getProfile)
  .put(protect, userController.updateProfile);

export default router;

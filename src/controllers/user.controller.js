import * as userService from '../services/user.service.js';

/**
 * Handle new user registration
 */
export const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    // Use status code from AppError, or default to 400
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

/**
 * Handle user login
 */
export const login = async (req, res) => {
  try {
    const user = await userService.loginUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    // Use status code from AppError, or default to 401
    res.status(error.statusCode || 401).json({ message: error.message });
  }
};

/**
 * Get user profile (a protected route example)
 */
export const getProfile = async (req, res) => {
    // req.user is attached by the authMiddleware
    // We are just sending it back to confirm it works.
    res.status(200).json(req.user);
};

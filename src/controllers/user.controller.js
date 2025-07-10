import * as userService from '../services/user.service.js';

/**
 * Handle new user registration
 */
export const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
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
    res.status(error.statusCode || 401).json({ message: error.message });
  }
};

/**
 * Get user profile
 */
export const getProfile = async (req, res) => {
    res.status(200).json(req.user);
};

/**
 * Handle user profile update
 */
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};
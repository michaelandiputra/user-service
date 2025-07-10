import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import AppError from '../utils/AppError.js';

// Function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  const { username, email, password } = userData;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User with this email already exists', 400);
  }
  const user = await User.create({ username, email, password });
  if (user) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    };
  } else {
    throw new AppError('Invalid user data', 400);
  }
};

/**
 * Authenticate a user and get a token
 */
export const loginUser = async (userData) => {
    const { email, password } = userData;
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
        return {
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        };
    } else {
        throw new AppError('Invalid email or password', 401);
    }
};

/**
 * Update user profile
 * @param {string} userId - The ID of the user to update
 * @param {object} updateData - The data to update
 * @returns {object} The updated user object
 */
export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update username and email if provided
  user.username = updateData.username || user.username;
  user.email = updateData.email || user.email;

  // Update password if provided
  if (updateData.password) {
    user.password = updateData.password;
  }

  const updatedUser = await user.save();

  return {
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
  };
};

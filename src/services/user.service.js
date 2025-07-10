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
 * @param {object} userData - The user data from the controller
 * @returns {object} The new user and token
 */
export const registerUser = async (userData) => {
  const { username, email, password } = userData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
  });

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
 * @param {object} userData - The user login data
 * @returns {object} The user and token
 */
export const loginUser = async (userData) => {
    const { email, password } = userData;

    // Check if user exists
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
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

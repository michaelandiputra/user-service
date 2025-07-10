import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js'; // Import your express app
import User from '../src/models/user.model.js';
import { config } from '../src/config/index.js';

// Connect to a test database before all tests
beforeAll(async () => {
  // Use a separate test database
  const testMongoUri = config.mongoUri + '-test';
  await mongoose.connect(testMongoUri);
});

// Clear the users collection before each test
beforeEach(async () => {
  await User.deleteMany({});
});

// Disconnect from the database after all tests
afterAll(async () => {
  await mongoose.connection.close();
});


// --- Test Suite for User Authentication ---
describe('User API - /api/users', () => {

  // Test for successful user registration
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    
    // Assertions
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('testuser');
  });

  // Test to prevent duplicate user registration
  it('should fail to register a user with a duplicate email', async () => {
    // First, create a user
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    // Then, try to create another user with the same email
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'anotheruser',
        email: 'test@example.com',
        password: 'password456',
      });
      
    // Assertions
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('User with this email already exists');
  });

  // Test for successful user login
  it('should log in an existing user successfully', async () => {
    // First, register the user
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123',
      });

    // Then, try to log in
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    // Assertions
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('loginuser');
  });

  // Test for failed login with wrong password
  it('should fail to log in with an incorrect password', async () => {
    // First, register the user
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123',
      });

    // Then, try to log in with the wrong password
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

    // Assertions
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js'; // Import your express app
import User from '../src/models/user.model.js';
import { config } from '../src/config/index.js';

let testUser;
let token;

// Connect to a test database and create a user before all tests
beforeAll(async () => {
  const testMongoUri = config.mongoUri + '-test';
  await mongoose.connect(testMongoUri);

  testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };
});

// Clear the users collection before each test
beforeEach(async () => {
  await User.deleteMany({});
  // Register and log in a user to get a fresh token for each test
  const registeredUser = await request(app).post('/api/users/register').send(testUser);
  token = registeredUser.body.token;
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
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  // Test for successful user login
  it('should log in an existing user successfully', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  // Test for getting user profile
  it('should get the user profile for an authenticated user', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe(testUser.username);
  });

  // Test for updating user profile
  it('should update the user profile for an authenticated user', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'updateduser',
        email: 'updated@example.com',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe('updateduser');
    expect(res.body.email).toBe('updated@example.com');
  });

  // Test for failing to update profile without auth
  it('should fail to update profile if not authenticated', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .send({
        username: 'updateduser',
      });

    expect(res.statusCode).toEqual(401);
  });
});
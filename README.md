# User Service for Personalized Learning Platform
This repository contains the source code for the User Service, a core component of the personalized online learning platform. This microservice is responsible for handling all user-related functionalities, including registration, login, and profile management.

# Features
User Registration: Securely register new users with hashed passwords.

User Login: Authenticate users and provide them with a JSON Web Token (JWT).

Protected Routes: Middleware to protect specific endpoints, ensuring only authenticated users can access them.

Automated Testing: A full suite of tests using Jest and Supertest to ensure reliability.

# Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

# Prerequisites
Node.js (v18.x or later recommended)

MongoDB (either a local instance or a cloud-based instance like MongoDB Atlas)

npm (comes bundled with Node.js)

# Installation
Clone the repository:

git clone https://github.com/michaelandiputra/user-service

Navigate into the project directory:

cd user-service

Install the dependencies:

npm install

Environment Variables
This project uses a .env file to manage environment variables. Create a file named .env in the root of your project and add the following variables:

# The port the server will run on
PORT=3001

# Your full MongoDB connection string (local or Atlas)
MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority"

# A strong, secret key for signing JWTs
Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your_super_secret_key_here"

# Running the Application
Development Mode
To run the server in development mode with nodemon (which automatically restarts on file changes):

npm run dev

The server will be available at http://localhost:3001.

# Running Tests
To run the automated tests for the API endpoints:

npm test

# API Endpoints
The following endpoints are available:

## POST /api/users/register
Registers a new user.

Body (raw/json):

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

Success Response (201 Created): Returns the user object and a JWT.

Failure Response (400 Bad Request): If email already exists or data is invalid.

## POST /api/users/login
Logs in an existing user.

Body (raw/json):

{
  "email": "test@example.com",
  "password": "password123"
}

Success Response (200 OK): Returns the user object and a JWT.

Failure Response (401 Unauthorized): If email or password is incorrect.

## GET /api/users/profile
Retrieves the profile of the currently authenticated user.

Authorization: This is a protected route. You must provide the JWT in the Authorization header.

Type: Bearer Token

Token: your_jwt_token_here

Success Response (200 OK): Returns the user object (without the password).

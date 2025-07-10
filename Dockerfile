# --- Stage 1: Build Stage ---
# Use an official Node.js image as the base.
# 'alpine' is a lightweight version of Linux, great for smaller images.
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
# This takes advantage of Docker's layer caching.
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# --- Stage 2: Production Stage ---
FROM node:18-alpine

WORKDIR /app

# FIX: Copy package.json so Node.js knows to use ES Modules
COPY --from=builder /app/package.json ./package.json

# Copy dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application code from the builder stage
COPY --from=builder /app/src ./src

# Expose the port the app runs on
EXPOSE 3001

# The command to run when the container starts
CMD ["node", "src/server.js"]

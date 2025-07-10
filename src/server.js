import mongoose from 'mongoose';
import app from './app.js';
import { config } from './config/index.js';

const port = config.port || 3001;

const connectDB = async () => {
  try {
    // Mongoose connection options
    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB connected successfully.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const startServer = () => {
  app.listen(port, () => {
    console.log(`🚀 User service listening on http://localhost:${port}`);
  });
};

// Connect to DB then start server
connectDB().then(() => {
    startServer();
});

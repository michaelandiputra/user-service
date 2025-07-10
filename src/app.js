import express from 'express';
import cors from 'cors';
import userRoutes from './api/routes/user.routes.js';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'user-service' });
});

app.use('/api/users', userRoutes);

export default app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import requestRoutes from './routes/requests.js';
import notificationRoutes from './routes/notifications.js';
import locationRoutes from './routes/location.js';
import uploadRoutes from './routes/upload.js';
import laborerRoutes from './routes/laborers.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/laborers', laborerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'LabourEase API Server is running!', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    database: 'LocalStorage (In-Memory)',
    version: '1.0.0'
  });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
} else {
  // Development route
  app.get('/', (req, res) => {
    res.json({
      message: 'LabourEase API Server',
      description: 'Connecting customers with skilled laborers',
      status: 'Running',
      frontend: 'http://localhost:5173',
      api: `http://localhost:${PORT}/api`,
      endpoints: {
        auth: '/api/auth',
        laborers: '/api/laborers',
        requests: '/api/requests',
        users: '/api/users'
      }
    });
  });
}

// Error handling middleware
app.use(errorHandler);

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LabourEase Server is running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend: http://localhost:5173`);
  console.log(`💾 Using LocalStorage for data persistence`);
  console.log(`🔗 Connect customers with skilled laborers!`);
});

export default app;
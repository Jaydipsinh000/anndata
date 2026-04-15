import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import landRoutes from './routes/landRoutes.js';
import partnershipRoutes from './routes/partnershipRoutes.js';
import toolRoutes from './routes/toolRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import toolBookingRoutes from './routes/toolBookingRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import path from 'path';

dotenv.config();

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Setup Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1); // Trust first proxy for Render load balancers

// Security Middleware
app.use(helmet());

// Strict CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use('/api', apiLimiter);
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/partnerships', partnershipRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tool-bookings', toolBookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

// Make 'uploads' folder statically accessible
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Anndata MERN Backend is running');
});

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/anndata-mern';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

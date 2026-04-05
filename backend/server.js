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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

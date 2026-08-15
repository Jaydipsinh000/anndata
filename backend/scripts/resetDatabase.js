import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Crop from '../models/Crop.js';
import Land from '../models/Land.js';
import Marketplace from '../models/Marketplace.js';
import Service from '../models/Service.js';
import Tool from '../models/Tool.js';
import ToolBooking from '../models/ToolBooking.js';
import AdvanceBooking from '../models/AdvanceBooking.js';
import Partnership from '../models/Partnership.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Subscription from '../models/Subscription.js';
import Message from '../models/Message.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/anndata';

async function resetDatabase() {
  try {
    console.log('Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI);

    console.log('Clearing ALL collections completely...');
    await Promise.all([
      User.deleteMany({}),
      Admin.deleteMany({}),
      Crop.deleteMany({}),
      Land.deleteMany({}),
      Marketplace.deleteMany({}),
      Service.deleteMany({}),
      Tool.deleteMany({}),
      ToolBooking.deleteMany({}),
      AdvanceBooking.deleteMany({}),
      Partnership.deleteMany({}),
      Order.deleteMany({}),
      Product.deleteMany({}),
      Subscription.deleteMany({}),
      Message.deleteMany({})
    ]);

    console.log('All collections wiped clean!');

    // Hash Password for Super Admin
    const salt = await bcrypt.genSalt(10);
    const superAdminPassword = await bcrypt.hash('Jay@123', salt);

    // Create Super Admin in Admin Collection
    await Admin.create({
      username: 'jaydipsinh',
      email: 'jaydipsinh@anndata.com',
      password: superAdminPassword,
      role: 'superadmin'
    });

    // Create Super Admin in User Collection (for unified login)
    await User.create({
      name: 'Jaydipsinh (Super Admin)',
      email: 'jaydipsinh@anndata.com',
      password: superAdminPassword,
      role: 'superadmin',
      mobile: '9876543210',
      status: 'approved',
      trust_badge: 'verified'
    });

    console.log('\n============================================================');
    console.log('SUPER ADMIN ACCOUNT CREATED SUCCESSFULLY!');
    console.log('------------------------------------------------------------');
    console.log('Super Admin Email:    jaydipsinh@anndata.com');
    console.log('Super Admin Password: Jay@123');
    console.log('Role:                 superadmin');
    console.log('============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();

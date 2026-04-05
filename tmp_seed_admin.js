import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './backend/models/User.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existingAdmin = await User.findOne({ email: 'jaydipsinh@anndata.com' });
    if(existingAdmin) {
       console.log('Admin already exists. Updating password...');
       const salt = await bcrypt.genSalt(10);
       existingAdmin.password = await bcrypt.hash('Jay@123', salt);
       existingAdmin.name = 'Jaydipsinh';
       existingAdmin.role = 'admin';
       await existingAdmin.save();
       console.log('Admin updated successfully');
       process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Jay@123', salt);
    
    await User.create({
      name: 'Jaydipsinh',
      email: 'jaydipsinh@anndata.com',
      password: hashedPassword,
      mobile: '0000000000',
      address: 'Anndata HQ',
      role: 'admin'
    });
    
    console.log('Admin Jaydipsinh seeded successfully');
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['farmer', 'worker', 'buyer', 'admin', 'superadmin'],
    default: 'farmer'
  },
  mobile: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'blocked', 'suspended'],
    default: 'pending'
  },
  trust_badge: {
    type: String,
    enum: ['pending', 'verified', 'suspended'],
    default: 'pending'
  },
  admin_notes: {
    type: String,
    default: ''
  },
  crop_limit: {
    type: Number,
    default: 4
  },
  tool_limit: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true // This will automatically add created_at and updated_at
});

const User = mongoose.model('User', userSchema);
export default User;

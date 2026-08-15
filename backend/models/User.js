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

  // Structured Address Details (Village, Taluka, District)
  village: { type: String, default: '' },
  taluka: { type: String, default: '' },
  district: { type: String, default: '' },
  state: { type: String, default: 'Gujarat' },
  pincode: { type: String, default: '' },
  address: { type: String, required: false },

  // Real World Authentication Verifications
  mobile_verified: { type: Boolean, default: true },
  email_verified: { type: Boolean, default: true },

  // Verification & Trust
  aadhaar_last4: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'blocked', 'suspended'],
    default: 'approved'
  },
  trust_badge: {
    type: String,
    enum: ['pending', 'verified', 'suspended'],
    default: 'verified'
  },
  admin_notes: {
    type: String,
    default: ''
  },

  // Task Assignment & Work logs for Admins (Assigned by Super Admin)
  assigned_tasks: [{
    task_title: { type: String, required: true },
    description: { type: String },
    assigned_by: { type: String, default: 'Super Admin' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    due_date: { type: Date },
    created_at: { type: Date, default: Date.now }
  }],

  crop_limit: {
    type: Number,
    default: 4
  },
  tool_limit: {
    type: Number,
    default: 5
  },
  trust_score: {
    type: Number,
    default: 50
  },
  completed_deals: {
    type: Number,
    default: 0
  },
  rating_sum: {
    type: Number,
    default: 0
  },
  rating_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;

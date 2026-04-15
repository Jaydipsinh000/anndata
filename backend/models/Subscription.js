import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  plan_name: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  start_date: { type: Date, default: Date.now },
  expiry_date: { type: Date }
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);

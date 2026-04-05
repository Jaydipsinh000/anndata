import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan_name: { type: String, required: true },
  price: { type: Number, required: true },
  start_date: { type: Date, default: Date.now },
  end_date: { type: Date },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);

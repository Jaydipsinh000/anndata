import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tool_name: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  rent_price: { type: Number, default: 0 },
  rent_duration: { type: String, default: '1 day' }
}, { timestamps: true });

export default mongoose.model('Tool', toolSchema);

import mongoose from 'mongoose';

const marketplaceSchema = new mongoose.Schema({
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crop_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ['kg', 'quintal', 'ton'], default: 'kg' },
  price_per_unit: { type: Number, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },
  image: { type: String }
}, { timestamps: true });

export default mongoose.model('Marketplace', marketplaceSchema);

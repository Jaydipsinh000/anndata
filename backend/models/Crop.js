import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crop_name: { type: String, required: true },
  area_value: { type: Number, required: true },
  area_unit: { type: String, enum: ['Bigha', 'Acre', 'Hectare'], required: true },
  season: { type: String, enum: ['Monsoon', 'Winter', 'Summer', 'All Season'], required: true },
  expected_yield: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  area_size: { type: String, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  harvest_time: { type: String, default: '30 days' }
}, { timestamps: true });

export default mongoose.model('Crop', cropSchema);

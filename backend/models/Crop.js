import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  land_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Land' },
  crop_name: { type: String, required: true },
  category: { type: String, enum: ['Grains', 'Vegetables', 'Fruits', 'Spices', 'Other'], default: 'Other' },
  is_organic: { type: Boolean, default: false },

  // Type: growing = future crop, ready = harvested & available
  type: { type: String, enum: ['growing', 'ready'], default: 'ready' },

  // Common fields
  area_value: { type: Number, required: true },
  area_unit: { type: String, enum: ['Bigha', 'Acre', 'Hectare'], required: true },
  season: { type: String, enum: ['Monsoon', 'Winter', 'Summer', 'All Season'], required: true },
  area_size: { type: String, default: '' },
  price: { type: Number, default: 0 },

  // Growing crop fields
  sowing_date: { type: Date },
  expected_harvest_date: { type: Date },
  expected_yield_qty: { type: Number, default: 0 },
  expected_yield_unit: { type: String, enum: ['kg', 'quintal', 'ton'], default: 'kg' },
  advance_booking_enabled: { type: Boolean, default: false },

  // Ready crop fields
  available_qty: { type: Number, default: 0 },
  quality_grade: { type: String, enum: ['A', 'B', 'C', 'Ungraded'], default: 'Ungraded' },

  // Stock control (prevents overbooking)
  reserved_qty: { type: Number, default: 0 },

  // Legacy compat
  expected_yield: { type: String },
  stock: { type: Number, default: 0 },
  harvest_time: { type: String, default: '30 days' },

  status: { type: String, enum: ['pending', 'approved', 'rejected', 'harvested'], default: 'pending' },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
}, { timestamps: true });

export default mongoose.model('Crop', cropSchema);

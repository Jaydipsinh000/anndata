import mongoose from 'mongoose';

const landSchema = new mongoose.Schema({
  owner_type: { type: String, enum: ['company', 'farmer'], required: true },
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  area_in_acres: { type: Number, required: true },
  location: { type: String, required: true },
  soil_type: { type: String, required: false },
  
  // Advanced Fields
  purpose: { type: String, enum: ['lease', 'sale', 'partnership'], default: 'lease' },
  price: { type: Number, required: true, default: 0 },
  irrigation: { type: String, enum: ['tube-well', 'canal', 'rain-fed', 'none'], default: 'none' },

  // Lease Fields
  lease_duration_years: { type: Number },
  payout_frequency: { type: String, enum: ['monthly', 'half-yearly', 'yearly'] },
  contract_start_date: { type: Date },
  contract_end_date: { type: Date },

  // Partnership Fields
  partnership_needs: [{ type: String }],
  profit_sharing_ratio: { type: String, default: '50/50' },
  partnership_duration: { type: String, enum: ['1-season', '1-year'] },

  verification_document: { type: String, default: 'pending_upload' }, // For 7/12 or 8A docs
  admin_message: { type: String, default: '' }, // Reason for rejection or deal specifics

  status: { type: String, enum: ['pending', 'active', 'rejected', 'rented_to_company', 'partnership_active', 'sold'], default: 'pending' },
  current_crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: false }
}, { timestamps: true });

export default mongoose.model('Land', landSchema);

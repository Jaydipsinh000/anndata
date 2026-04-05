import mongoose from 'mongoose';

const landSchema = new mongoose.Schema({
  // Step 1: Basic
  title: { type: String, default: 'Untitled Land' },
  owner_type: { type: String, enum: ['company', 'farmer'], required: true },
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  area_in_acres: { type: Number, required: true },
  location: { type: String, required: true },
  map_pin: { 
    lat: { type: Number }, 
    lng: { type: Number }, 
    url: { type: String } 
  }, // Will store Google Map link/pin
  
  // Step 2: Quality
  soil_type: { type: String, enum: ['black', 'red', 'sandy', 'clay', 'alluvial', 'laterite', 'arid', 'light', 'medium'], required: false },
  water_source: { type: String, enum: ['borewell', 'canal', 'rain-fed', 'none'], default: 'none' },
  irrigation_system: { type: String, enum: ['drip', 'sprinkler', 'manual', 'none'], default: 'none' },
  electricity: { type: Boolean, default: false },

  // Step 3: Privacy Verification
  images: [{ type: String }],
  video: { type: String },
  privacy_verified: { type: Boolean, default: false }, // OTP & Self-declaration
  trust_badge: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  
  // Step 4: Purpose specific
  purpose: { type: String, enum: ['lease', 'sale', 'partnership'], default: 'lease' },
  
  // Option 1: Lease/Rent
  lease_duration_years: { type: Number },
  extendable: { type: Boolean, default: false },
  price: { type: Number, default: 0 }, // Used for sale or rent per year
  payout_frequency: { type: String, enum: ['monthly', 'half-yearly', 'yearly'] },
  
  // Option 2: Sell
  negotiable: { type: Boolean, default: true },
  
  // Option 3: Partnership
  profit_sharing_ratio: { type: String, default: '50/50' },
  farmer_contribution: { type: String, enum: ['land_only', 'land_labor'], default: 'land_only' },
  partnership_notes: { type: String },

  // Admin and Lifecycle Fields
  admin_message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'active', 'rejected', 'rented_to_company', 'partnership_active', 'sold'], default: 'pending' },
  current_crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: false },
  contract_start_date: { type: Date },
  contract_end_date: { type: Date }
}, { timestamps: true });

export default mongoose.model('Land', landSchema);

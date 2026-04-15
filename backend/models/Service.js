import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service_title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Labor', 'Transportation', 'Soil Testing', 'Veterinary', 'Advisory', 'Other'], 
    required: true 
  },
  location: { type: String, required: true },
  rate: { type: Number, required: true },
  rate_type: { type: String, enum: ['per hour', 'per day', 'flat fee', 'per acre'], required: true },
  description: { type: String },
  availability_status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
  contact_number: { type: String }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);

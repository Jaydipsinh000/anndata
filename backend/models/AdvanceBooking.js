import mongoose from 'mongoose';

const advanceBookingSchema = new mongoose.Schema({
  crop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requirements: { type: String },
  estimated_cost: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'farmer_accepted', 'rejected', 'admin_approved'], default: 'pending' },
  farmer_message: { type: String, default: '' },
  admin_message: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('AdvanceBooking', advanceBookingSchema);

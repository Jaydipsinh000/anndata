import mongoose from 'mongoose';

const NegotiationEntry = new mongoose.Schema({
  by: { type: String, enum: ['buyer', 'admin', 'farmer'], required: true },
  price: { type: Number },
  qty: { type: Number },
  message: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

const advanceBookingSchema = new mongoose.Schema({
  crop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  order_type: { type: String, enum: ['advance_booking', 'marketplace_purchase'], default: 'advance_booking' },

  requested_qty: { type: Number, default: 0 },
  offered_price: { type: Number, default: 0 },
  final_price: { type: Number, default: 0 },
  final_qty: { type: Number, default: 0 },

  requirements: { type: String },
  estimated_cost: { type: Number, default: 0 },

  negotiation_log: [NegotiationEntry],

  status: {
    type: String,
    enum: ['pending', 'negotiating', 'accepted', 'farmer_harvested', 'buyer_confirmed', 'completed', 'rejected'],
    default: 'pending'
  },

  farmer_message: { type: String, default: '' },
  admin_message: { type: String, default: '' },
  
  contract_url: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model('AdvanceBooking', advanceBookingSchema);

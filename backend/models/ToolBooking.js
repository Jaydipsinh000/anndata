import mongoose from 'mongoose';

const toolBookingSchema = new mongoose.Schema({
  tool_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
  lender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrower_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  booking_type: { type: String, enum: ['rent', 'purchase'], default: 'rent' },

  start_date: { type: Date },
  end_date: { type: Date },
  
  requested_qty: { type: Number, default: 1 },
  total_price: { type: Number, required: true },
  
  message: { type: String, default: '' },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_use', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('ToolBooking', toolBookingSchema);

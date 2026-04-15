import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AdvanceBooking', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  images: [{ type: String }],
  is_read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);

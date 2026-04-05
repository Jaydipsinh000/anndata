import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item_type: { type: String, enum: ['crop', 'product'], required: true },
  item_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  payment_status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  order_status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

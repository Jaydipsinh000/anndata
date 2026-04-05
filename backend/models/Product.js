import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ['Tools', 'Seeds', 'Fertilizer', 'Machinery', 'Other'], default: 'Tools' },
  image: { type: String },
  affiliate_link: { type: String }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

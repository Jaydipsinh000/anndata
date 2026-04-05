import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  is_completed: { type: Boolean, default: false },
  due_date: { type: Date }
});

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  borne_by: { type: String, enum: ['company', 'farmer'], required: true },
  date: { type: Date, default: Date.now }
});

const partnershipSchema = new mongoose.Schema({
  land_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Land', required: true },
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assigned_crop: { type: String, default: 'Pending Crop Assignment' },
  crop_stage: { type: String, enum: ['planning', 'sowing', 'growing', 'harvest'], default: 'planning' },
  expected_yield_tons: { type: Number, default: 0 },
  
  start_date: { type: Date },
  end_date: { type: Date },
  
  tasks: [TaskSchema],
  expenses: [ExpenseSchema],
  
  // Profit Settlement
  total_income: { type: Number, default: 0 },
  net_profit: { type: Number, default: 0 },
  final_farmer_share: { type: Number, default: 0 },
  final_company_share: { type: Number, default: 0 },

  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
}, {
  timestamps: true
});

const Partnership = mongoose.model('Partnership', partnershipSchema);
export default Partnership;

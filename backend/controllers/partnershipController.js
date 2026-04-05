import Partnership from '../models/Partnership.js';

// Get active contracts for logged-in farmer
export const getMyPartnerships = async (req, res) => {
  try {
    const partnerships = await Partnership.find({ farmer_id: req.user._id, status: { $ne: 'cancelled' } })
      .populate('land_id')
      .sort('-createdAt');
    res.json(partnerships);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Admin: Get all contracts
export const getAllPartnerships = async (req, res) => {
  try {
    const partnerships = await Partnership.find()
      .populate('farmer_id', 'name mobile')
      .populate('land_id')
      .sort('-createdAt');
    res.json(partnerships);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Admin: Setup basic fields (Crop, Dates, Status, Financials)
export const updatePartnershipBasic = async (req, res) => {
  try {
    const { 
       assigned_crop, start_date, end_date, status, 
       crop_stage, expected_yield_tons, total_income, 
       net_profit, final_farmer_share, final_company_share 
    } = req.body;
    
    const p = await Partnership.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });

    if (assigned_crop !== undefined) p.assigned_crop = assigned_crop;
    if (crop_stage !== undefined) p.crop_stage = crop_stage;
    if (expected_yield_tons !== undefined) p.expected_yield_tons = expected_yield_tons;
    
    if (start_date !== undefined) p.start_date = start_date;
    if (end_date !== undefined) p.end_date = end_date;
    if (status !== undefined) p.status = status;
    
    if (total_income !== undefined) p.total_income = total_income;
    if (net_profit !== undefined) p.net_profit = net_profit;
    if (final_farmer_share !== undefined) p.final_farmer_share = final_farmer_share;
    if (final_company_share !== undefined) p.final_company_share = final_company_share;

    await p.save();
    res.json(p);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Admin: Add a task timeline bullet
export const pushTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const p = await Partnership.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });

    p.tasks.push({ title, description, due_date, is_completed: false });
    await p.save();
    res.json(p);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Farmer/Admin: Checkoff a task
export const toggleTaskCompleted = async (req, res) => {
  try {
    const { taskId, is_completed } = req.body;
    const p = await Partnership.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });

    const task = p.tasks.id(taskId);
    if(task) {
       task.is_completed = is_completed;
       await p.save();
    }
    res.json(p);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Admin: Log a ledger expense
export const pushExpense = async (req, res) => {
  try {
    const { description, amount, borne_by } = req.body;
    const p = await Partnership.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });

    p.expenses.push({ description, amount: Number(amount), borne_by });
    await p.save();
    res.json(p);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

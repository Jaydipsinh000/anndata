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

// Admin: Setup basic fields (Crop, Dates, Status)
export const updatePartnershipBasic = async (req, res) => {
  try {
    const { assigned_crop, start_date, end_date, status } = req.body;
    const p = await Partnership.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });

    if (assigned_crop) p.assigned_crop = assigned_crop;
    if (start_date) p.start_date = start_date;
    if (end_date) p.end_date = end_date;
    if (status) p.status = status;

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

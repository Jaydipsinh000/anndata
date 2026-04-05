import Land from '../models/Land.js';

// Get all lands
export const getLands = async (req, res) => {
  try {
    const query = req.user ? { farmer_id: req.user._id } : {};
    const lands = await Land.find(query)
      .populate('farmer_id', 'name email mobile')
      .populate('current_crop', 'crop_name');
    res.json(lands);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lands', error: error.message });
  }
};

// Add a new land
export const addLand = async (req, res) => {
  try {
    const data = req.body;
    // Auto assign farmer_id from auth token
    if (data.owner_type === 'farmer') {
      data.farmer_id = req.user._id;
    }
    const newLand = new Land(data);
    const savedLand = await newLand.save();
    res.status(201).json(savedLand);
  } catch (error) {
    res.status(400).json({ message: 'Error creating land', error: error.message });
  }
};

// Update land
export const updateLand = async (req, res) => {
  try {
    const updated = await Land.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating land', error: error.message });
  }
};

// Delete land
export const deleteLand = async (req, res) => {
  try {
    await Land.findByIdAndDelete(req.params.id);
    res.json({ message: 'Land removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting land', error: error.message });
  }
};

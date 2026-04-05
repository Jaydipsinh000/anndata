import Crop from '../models/Crop.js';

export const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate('user_id', 'name email').sort('-createdAt');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ user_id: req.user._id }).sort('-createdAt');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCrop = async (req, res) => {
  try {
    const { crop_name, area_value, area_unit, season, expected_yield, area_size, stock, price } = req.body;
    
    // Assign user from protected token context
    const user_id = req.user._id;

    const crop = await Crop.create({
      user_id,
      crop_name,
      area_value,
      area_unit,
      season,
      expected_yield,
      area_size,
      stock,
      price
    });
    
    res.status(201).json(crop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

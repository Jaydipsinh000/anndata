import Crop from '../models/Crop.js';

// Public: Get all approved crops
export const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate('user_id', 'name email mobile').populate('land_id', 'location').sort('-createdAt');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Farmer: Get my crops
export const getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ user_id: req.user._id }).populate('land_id', 'location').sort('-createdAt');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Farmer: Add crop (handles both growing and ready)
export const addCrop = async (req, res) => {
  try {
    const {
      crop_name, type, land_id, area_value, area_unit, season, price,
      // Growing fields
      sowing_date, expected_harvest_date, expected_yield_qty, expected_yield_unit, advance_booking_enabled,
      // Ready fields
      available_qty, quality_grade,
      // Legacy
      expected_yield, area_size, stock
    } = req.body;

    const crop = await Crop.create({
      user_id: req.user._id,
      crop_name,
      type: type || 'ready',
      land_id: land_id || undefined,
      area_value,
      area_unit,
      season,
      price,
      area_size: area_size || `${area_value} ${area_unit}`,
      // Growing
      sowing_date, expected_harvest_date, expected_yield_qty, expected_yield_unit,
      advance_booking_enabled: advance_booking_enabled || false,
      // Ready
      available_qty: available_qty || stock || 0,
      quality_grade: quality_grade || 'Ungraded',
      stock: stock || available_qty || 0,
      expected_yield: expected_yield || `${expected_yield_qty || 0} ${expected_yield_unit || 'kg'}`
    });

    res.status(201).json(crop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Farmer: Mark a growing crop as harvested → converts to ready
export const markCropHarvested = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    if (crop.user_id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    const { final_qty, quality_grade, selling_price } = req.body;

    crop.type = 'ready';
    crop.status = 'harvested';
    crop.available_qty = final_qty || crop.expected_yield_qty || 0;
    crop.stock = crop.available_qty;
    crop.quality_grade = quality_grade || 'Ungraded';
    if (selling_price) crop.price = selling_price;

    await crop.save();
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: Get only ready crops for marketplace
export const getReadyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ type: 'ready', status: { $in: ['approved', 'harvested'] } })
      .populate('user_id', 'name email mobile')
      .populate('land_id', 'location')
      .sort('-createdAt');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: Get growing crops with advance booking enabled
export const getGrowingCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ type: 'growing', status: 'approved', advance_booking_enabled: true })
      .populate('user_id', 'name email mobile')
      .populate('land_id', 'location')
      .sort('-createdAt');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import User from '../models/User.js';
import Crop from '../models/Crop.js';
import Marketplace from '../models/Marketplace.js';
import Land from '../models/Land.js';
import Tool from '../models/Tool.js';
import Partnership from '../models/Partnership.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCrops = await Crop.countDocuments();
    const pendingCrops = await Crop.countDocuments({ status: 'pending' });
    const marketItems = await Marketplace.countDocuments();

    res.json({
      totalUsers,
      totalCrops,
      pendingCrops,
      marketItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status, trust_badge, admin_notes } = req.body;
    const user = await User.findById(req.params.id);
    if(user) {
      if (status !== undefined) user.status = status;
      if (trust_badge !== undefined) user.trust_badge = trust_badge;
      if (admin_notes !== undefined) user.admin_notes = admin_notes;

      await user.save();
      res.json({ message: 'User status updated', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate('user_id', 'name email').sort('-createdAt');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCropStatus = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if(crop) {
      crop.status = req.body.status || crop.status;
      crop.approved_by = req.body.status === 'approved' ? req.user._id : crop.approved_by;
      await crop.save();
      res.json({ message: 'Crop status updated', crop });
    } else {
      res.status(404).json({ message: 'Crop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminLands = async (req, res) => {
  try {
    const lands = await Land.find().populate('farmer_id').sort('-createdAt');
    res.json(lands);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
export const updateLandStatus = async (req, res) => {
  try {
    const { status, admin_message, contract_start_date, contract_end_date, trust_badge, next_payment_date, payment_schedule } = req.body;
    const land = await Land.findById(req.params.id);
    
    if (land) {
      const oldStatus = land.status;
      land.status = status || land.status;
      if (admin_message !== undefined) land.admin_message = admin_message;
      if (contract_start_date) land.contract_start_date = contract_start_date;
      if (contract_end_date) land.contract_end_date = contract_end_date;
      if (trust_badge) land.trust_badge = trust_badge;
      if (next_payment_date) land.next_payment_date = next_payment_date;
      if (payment_schedule) land.payment_schedule = payment_schedule;
      
      const updatedLand = await land.save();

      if (status === 'partnership_active' && oldStatus !== 'partnership_active') {
        const existing = await Partnership.findOne({ land_id: land._id });
        if (!existing) {
          await Partnership.create({
             land_id: land._id,
             farmer_id: land.farmer_id,
             assigned_crop: 'Waiting for Admin Assignment',
             status: 'active'
          });
        } else {
          existing.status = 'active';
          await existing.save();
        }
      } else if (status !== 'partnership_active' && oldStatus === 'partnership_active') {
        const existing = await Partnership.findOne({ land_id: land._id });
        if (existing) {
          existing.status = 'cancelled';
          await existing.save();
        }
      }

      res.json(updatedLand);
    } else res.status(404).json({ message: 'Land not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getAdminTools = async (req, res) => {
  try {
    const tools = await Tool.find().populate('user_id').sort('-createdAt');
    res.json(tools);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
export const updateToolStatus = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if(tool) {
      tool.status = req.body.status || tool.status;
      tool.approved_by = req.body.status === 'approved' ? req.user._id : tool.approved_by;
      await tool.save();
      res.json({ message: 'Tool status updated', tool });
    } else res.status(404).json({ message: 'Tool not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getAdminMarketplace = async (req, res) => {
  try {
    const items = await Marketplace.find().populate('farmer_id').sort('-createdAt');
    res.json(items);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
export const updateMarketplaceStatus = async (req, res) => {
  try {
    const item = await Marketplace.findById(req.params.id);
    if(item) {
      item.status = req.body.status || item.status;
      await item.save();
      res.json({ message: 'Marketplace status updated', item });
    } else res.status(404).json({ message: 'Item not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

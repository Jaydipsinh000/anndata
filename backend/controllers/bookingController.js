import AdvanceBooking from '../models/AdvanceBooking.js';
import Crop from '../models/Crop.js';

export const createBooking = async (req, res) => {
  try {
    const { crop_id, requirements, estimated_cost, farmer_id } = req.body;
    const booking = await AdvanceBooking.create({
      crop_id,
      buyer_id: req.user._id,
      farmer_id,
      requirements,
      estimated_cost
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await AdvanceBooking.find({
      $or: [{ buyer_id: req.user._id }, { farmer_id: req.user._id }]
    })
    .populate('crop_id')
    .populate('buyer_id', 'name email mobile')
    .populate('farmer_id', 'name email mobile')
    .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await AdvanceBooking.find()
      .populate('crop_id')
      .populate('buyer_id', 'name email mobile')
      .populate('farmer_id', 'name email mobile')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    const booking = await AdvanceBooking.findById(req.params.id);
    
    if (booking) {
      booking.status = status || booking.status;
      
      if (req.user.role === 'farmer') {
        if (message) booking.farmer_message = message;
      } else if (req.user.role === 'admin' || req.user.role === 'superadmin') {
        if (message) booking.admin_message = message;
      }

      await booking.save();
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import AdvanceBooking from '../models/AdvanceBooking.js';
import Crop from '../models/Crop.js';
import { generateContractPDF } from '../utils/pdfGenerator.js';

// Buyer: Place a booking or purchase request
export const createBooking = async (req, res) => {
  try {
    const { crop_id, farmer_id, requirements, estimated_cost, requested_qty, offered_price, order_type } = req.body;

    // Validate stock availability
    const crop = await Crop.findById(crop_id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });

    const availableForBooking = (crop.type === 'ready')
      ? (crop.available_qty - crop.reserved_qty)
      : (crop.expected_yield_qty - crop.reserved_qty);

    if (requested_qty && requested_qty > availableForBooking) {
      return res.status(400).json({ message: `Only ${availableForBooking} ${crop.expected_yield_unit || 'kg'} available for booking.` });
    }

    const booking = await AdvanceBooking.create({
      crop_id,
      buyer_id: req.user._id,
      farmer_id: farmer_id || crop.user_id,
      order_type: order_type || (crop.type === 'ready' ? 'marketplace_purchase' : 'advance_booking'),
      requested_qty: requested_qty || 0,
      offered_price: offered_price || crop.price,
      requirements,
      estimated_cost: estimated_cost || (requested_qty * (offered_price || crop.price)),
      negotiation_log: [{
        by: 'buyer',
        price: offered_price || crop.price,
        qty: requested_qty || 0,
        message: requirements || 'Initial offer'
      }]
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Buyer/Farmer: Get my bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await AdvanceBooking.find({
      $or: [{ buyer_id: req.user._id }, { farmer_id: req.user._id }]
    })
    .populate('crop_id')
    .populate('buyer_id', 'name email mobile trust_badge completed_deals')
    .populate('farmer_id', 'name email mobile trust_badge completed_deals')
    .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all bookings
export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await AdvanceBooking.find()
      .populate('crop_id')
      .populate('buyer_id', 'name email mobile trust_badge completed_deals')
      .populate('farmer_id', 'name email mobile trust_badge completed_deals')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin/Farmer/Buyer: Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, message, final_qty } = req.body;
    const booking = await AdvanceBooking.findById(req.params.id)
       .populate('buyer_id', 'name email')
       .populate('farmer_id', 'name email');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const oldStatus = booking.status;
    booking.status = status || booking.status;

    if (req.user.role === 'farmer') {
      if (message) booking.farmer_message = message;
    } else if (['admin', 'superadmin'].includes(req.user.role)) {
      if (message) booking.admin_message = message;
    }

    if (final_qty !== undefined) {
      booking.final_qty = final_qty;
    }

    // When admin accepts → reserve the quantity on the crop
    if (status === 'accepted' && oldStatus !== 'accepted') {
      const crop = await Crop.findById(booking.crop_id);
      if (crop) {
        const qty = booking.final_qty || booking.requested_qty;
        crop.reserved_qty = (crop.reserved_qty || 0) + qty;
        await crop.save();
      }
      booking.final_qty = booking.final_qty || booking.requested_qty;
      booking.final_price = booking.final_price || booking.offered_price;

      try {
         const fileName = `Anndata-Contract-${booking._id}.pdf`;
         const docPath = await generateContractPDF(booking, fileName);
         booking.contract_url = docPath;
      } catch (err) {
         console.error("PDF Generation failed:", err);
      }
    }

    // When completed → deduct from available
    if (status === 'completed' && oldStatus !== 'completed') {
      const crop = await Crop.findById(booking.crop_id);
      if (crop) {
        const qty = booking.final_qty || booking.requested_qty;
        crop.available_qty = Math.max(0, (crop.available_qty || 0) - qty);
        crop.reserved_qty = Math.max(0, (crop.reserved_qty || 0) - qty);
        crop.stock = crop.available_qty;
        await crop.save();
      }
    }

    // When rejected → release reserved
    if (status === 'rejected' && oldStatus === 'accepted') {
      const crop = await Crop.findById(booking.crop_id);
      if (crop) {
        const qty = booking.final_qty || booking.requested_qty;
        crop.reserved_qty = Math.max(0, (crop.reserved_qty || 0) - qty);
        await crop.save();
      }
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Shared: Send counter-offer (negotiation)
export const negotiateBooking = async (req, res) => {
  try {
    const { price, qty, message } = req.body;
    const booking = await AdvanceBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Determine who is negotiating
    let negotiator = 'buyer';
    if (['admin', 'superadmin'].includes(req.user.role)) negotiator = 'admin';
    else if (req.user.role === 'farmer') negotiator = 'farmer';

    booking.status = 'negotiating';
    booking.negotiation_log.push({
      by: negotiator,
      price: price || booking.offered_price,
      qty: qty || booking.requested_qty,
      message: message || `Counter offer from ${negotiator}`
    });

    // Update the live offer numbers
    if (price) booking.offered_price = price;
    if (qty) booking.requested_qty = qty;

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

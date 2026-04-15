import ToolBooking from '../models/ToolBooking.js';
import Tool from '../models/Tool.js';

// Rent or Buy a tool
export const createToolBooking = async (req, res) => {
  try {
    const { tool_id, booking_type, start_date, end_date, requested_qty, message } = req.body;
    
    const tool = await Tool.findById(tool_id);
    if (!tool) return res.status(404).json({ message: 'Tool not found' });

    if (requested_qty > tool.stock) {
      return res.status(400).json({ message: `Only ${tool.stock} units available.` });
    }

    // Advanced: Check for overlapping conflicting dates if it's a rental
    if (booking_type === 'rent') {
       const existingBookings = await ToolBooking.find({
          tool_id,
          status: { $in: ['accepted', 'in_use'] },
          start_date: { $lte: new Date(end_date) },
          end_date: { $gte: new Date(start_date) }
       });

       let reservedQty = 0;
       existingBookings.forEach(b => { reservedQty += b.requested_qty; });
       if (reservedQty + requested_qty > tool.stock) {
         return res.status(400).json({ message: 'Tool is already fully booked for the selected dates.' });
       }
    }

    // Calculate cost
    let total_price = 0;
    if (booking_type === 'purchase') {
      total_price = tool.price * requested_qty;
    } else {
      const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)) || 1;
      total_price = tool.rent_price * requested_qty * days;
    }

    const booking = await ToolBooking.create({
      tool_id,
      lender_id: tool.user_id,
      borrower_id: req.user._id,
      booking_type,
      start_date,
      end_date,
      requested_qty,
      total_price,
      message
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my tool bookings (borrowed or lent)
export const getMyToolBookings = async (req, res) => {
  try {
    const bookings = await ToolBooking.find({
      $or: [{ borrower_id: req.user._id }, { lender_id: req.user._id }]
    })
    .populate('tool_id')
    .populate('borrower_id', 'name email mobile')
    .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update status
export const updateToolBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await ToolBooking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Only lender or admin can accept/reject/complete
    if (booking.lender_id.toString() !== req.user.id && !['admin', 'superadmin'].includes(req.user.role)) {
       return res.status(403).json({ message: 'Not authorized logic' });
    }

    booking.status = status;

    // Handle stock logic if purchase completed
    if (status === 'completed' && booking.booking_type === 'purchase') {
       const tool = await Tool.findById(booking.tool_id);
       if(tool) {
         tool.stock = Math.max(0, tool.stock - booking.requested_qty);
         await tool.save();
       }
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

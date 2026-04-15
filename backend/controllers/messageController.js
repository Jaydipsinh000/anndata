import Message from '../models/Message.js';
import AdvanceBooking from '../models/AdvanceBooking.js';

// Send a chat message within a booking
export const sendMessage = async (req, res) => {
  try {
    const { booking_id, text, images } = req.body;

    const booking = await AdvanceBooking.findById(booking_id);
    if (!booking) return res.status(404).json({ message: 'Deal not found' });

    // Validate that the user sending the message is part of this deal (or an admin)
    if (
      booking.farmer_id.toString() !== req.user.id && 
      booking.buyer_id.toString() !== req.user.id &&
      !['admin', 'superadmin'].includes(req.user.role)
    ) {
      return res.status(403).json({ message: 'Not authorized for this deal chat' });
    }

    const newMessage = await Message.create({
      booking_id,
      sender: req.user._id,
      text,
      images: images || []
    });

    const populatedMsg = await newMessage.populate('sender', 'name role');
    res.status(201).json(populatedMsg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all chat messages for a specific booking
export const getMessages = async (req, res) => {
  try {
    const booking_id = req.params.bookingId;

    const booking = await AdvanceBooking.findById(booking_id);
    if (!booking) return res.status(404).json({ message: 'Deal not found' });

    if (
      booking.farmer_id.toString() !== req.user.id && 
      booking.buyer_id.toString() !== req.user.id &&
      !['admin', 'superadmin'].includes(req.user.role)
    ) {
      return res.status(403).json({ message: 'Not authorized for this deal chat' });
    }

    const messages = await Message.find({ booking_id })
      .populate('sender', 'name role')
      .sort('createdAt'); // Oldest first

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

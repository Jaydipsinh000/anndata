import Marketplace from '../models/Marketplace.js';
import Order from '../models/Order.js';

export const getMarketplaceItems = async (req, res) => {
  try {
    const items = await Marketplace.find({ status: 'available' }).populate('farmer_id', 'name email mobile address').sort('-createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMarketplaceItem = async (req, res) => {
  try {
    const data = req.body;
    data.farmer_id = req.user._id;
    // normally handle image upload here
    const item = await Marketplace.create(data);
    
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { item_id, item_type, quantity, total_amount } = req.body;
    
    const order = await Order.create({
      buyer_id: req.user._id,
      item_id, item_type, quantity, total_amount,
      payment_status: 'paid', // Mock payment step
      order_status: 'processing'
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

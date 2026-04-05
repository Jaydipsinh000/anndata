import Tool from '../models/Tool.js';

export const getTools = async (req, res) => {
  try {
    const tools = await Tool.find({ status: 'approved' }).populate('user_id', 'name email mobile').sort('-createdAt');
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTool = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;
    // For MVP, auto-approve new tools
    data.status = 'approved'; 
    const tool = await Tool.create(data);
    res.status(201).json(tool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

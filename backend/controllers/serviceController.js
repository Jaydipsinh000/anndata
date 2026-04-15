import Service from '../models/Service.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ availability_status: { $ne: 'offline' } })
      .populate('provider_id', 'name email mobile trust_score')
      .sort('-createdAt');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const data = req.body;
    data.provider_id = req.user._id;
    
    // Fallback context: fetch default mobile from user if empty
    if (!data.contact_number && req.user.mobile) {
       data.contact_number = req.user.mobile;
    }

    const service = await Service.create(data);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const service = await Service.findById(req.params.id);
    
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    // Only provider or admin can edit
    if (service.provider_id.toString() !== req.user.id && !['admin', 'superadmin'].includes(req.user.role)) {
       return res.status(403).json({ message: 'Not authorized logic' });
    }

    service.availability_status = status;
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

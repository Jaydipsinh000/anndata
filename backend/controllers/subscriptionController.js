import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

export const getMySubscription = async (req, res) => {
  try {
    let sub = await Subscription.findOne({ user_id: req.user._id });
    
    // Automatically create a 'Free' tier if user doesn't have one
    if (!sub) {
      sub = await Subscription.create({
         user_id: req.user._id,
         plan_name: 'Free'
      });
    }

    res.json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upgradeSubscription = async (req, res) => {
  try {
    const { plan_name, duration_days } = req.body;
    let sub = await Subscription.findOne({ user_id: req.user._id });
    
    if (!sub) {
      sub = new Subscription({ user_id: req.user._id });
    }

    sub.plan_name = plan_name;
    sub.status = 'active';
    sub.start_date = new Date();
    
    if (duration_days) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + duration_days);
      sub.expiry_date = expiry;
    } else {
      sub.expiry_date = null; // Lifetime or open-ended
    }

    await sub.save();

    // Optionally update user's role/trust score context
    const user = await User.findById(req.user._id);
    if(user && plan_name === 'Pro') {
      user.trust_score = Math.min(100, (user.trust_score || 0) + 10);
      await user.save();
    }

    res.json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

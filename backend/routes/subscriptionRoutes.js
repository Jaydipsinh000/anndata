import express from 'express';
import { getMySubscription, upgradeSubscription } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMySubscription);
router.post('/upgrade', protect, upgradeSubscription);

export default router;

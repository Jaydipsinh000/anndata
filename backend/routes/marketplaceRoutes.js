import express from 'express';
import { getMarketplaceItems, addMarketplaceItem, placeOrder } from '../controllers/marketplaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMarketplaceItems);
router.post('/', protect, addMarketplaceItem);
router.post('/orders', protect, placeOrder);

export default router;

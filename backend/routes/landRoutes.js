import express from 'express';
import { getLands, addLand, updateLand, deleteLand, respondLandProposal } from '../controllers/landController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getLands);
router.post('/', protect, addLand);
router.put('/:id/respond', protect, respondLandProposal);
router.put('/:id', protect, updateLand);
router.delete('/:id', protect, deleteLand);

export default router;

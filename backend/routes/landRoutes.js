import express from 'express';
import { getLands, addLand, updateLand, deleteLand } from '../controllers/landController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getLands);
router.post('/', protect, addLand);
router.put('/:id', protect, updateLand);
router.delete('/:id', protect, deleteLand);

export default router;

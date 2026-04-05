import express from 'express';
import { getCrops, addCrop, getMyCrops } from '../controllers/cropController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCrops);
router.post('/', protect, addCrop);
router.get('/mycrops', protect, getMyCrops);

export default router;

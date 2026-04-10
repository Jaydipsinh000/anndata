import express from 'express';
import { getCrops, addCrop, getMyCrops, markCropHarvested, getReadyCrops, getGrowingCrops } from '../controllers/cropController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCrops);
router.get('/ready', getReadyCrops);
router.get('/growing', getGrowingCrops);
router.post('/', protect, addCrop);
router.get('/mycrops', protect, getMyCrops);
router.patch('/:id/harvest', protect, markCropHarvested);

export default router;

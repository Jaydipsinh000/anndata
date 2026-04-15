import express from 'express';
import { getWeather, analyzeCropImage } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/weather', protect, getWeather);
router.post('/analyze-crop', protect, analyzeCropImage);

export default router;

import express from 'express';
import { getWeather, analyzeCropImage, askAiAgronomist } from '../controllers/aiController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/weather', optionalProtect, getWeather);
router.post('/analyze-crop', optionalProtect, analyzeCropImage);
router.post('/ask', optionalProtect, askAiAgronomist);

export default router;

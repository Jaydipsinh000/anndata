import express from 'express';
import { getWeather, analyzeCropImage, askAiAgronomist } from '../controllers/aiController.js';

const router = express.Router();

router.get('/weather', getWeather);
router.post('/analyze-crop', analyzeCropImage);
router.post('/ask', askAiAgronomist);

export default router;


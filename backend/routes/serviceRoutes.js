import express from 'express';
import { getServices, createService, updateServiceStatus } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getServices); // Public listing
router.post('/', protect, createService); // Authenticated creation
router.patch('/:id/status', protect, updateServiceStatus);

export default router;

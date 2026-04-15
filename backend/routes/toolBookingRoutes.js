import express from 'express';
import { createToolBooking, getMyToolBookings, updateToolBookingStatus } from '../controllers/toolBookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createToolBooking);
router.get('/my', protect, getMyToolBookings);
router.patch('/:id/status', protect, updateToolBookingStatus);

export default router;

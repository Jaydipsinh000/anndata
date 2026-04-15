import express from 'express';
import { createBooking, getMyBookings, getAdminBookings, updateBookingStatus, negotiateBooking } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/admin', protect, admin, getAdminBookings);
router.patch('/:id/status', protect, updateBookingStatus);
router.patch('/:id/negotiate', protect, negotiateBooking);

export default router;

import express from 'express';
import { registerUser, loginUser, googleLogin, mobileLogin, sendMobileOtp, sendEmailOtp, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/mobile-login', mobileLogin);
router.post('/send-mobile-otp', sendMobileOtp);
router.post('/send-email-otp', sendEmailOtp);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;

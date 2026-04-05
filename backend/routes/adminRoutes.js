import express from 'express';
import { 
  getDashboardStats, getUsers, updateUserStatus, 
  getAdminCrops, updateCropStatus,
  getAdminLands, updateLandStatus,
  getAdminTools, updateToolStatus,
  getAdminMarketplace, updateMarketplaceStatus
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getUsers);
router.patch('/users/:id/status', protect, admin, updateUserStatus);

router.get('/crops', protect, admin, getAdminCrops);
router.patch('/crops/:id/status', protect, admin, updateCropStatus);

router.get('/lands', protect, admin, getAdminLands);
router.patch('/lands/:id/status', protect, admin, updateLandStatus);

router.get('/tools', protect, admin, getAdminTools);
router.patch('/tools/:id/status', protect, admin, updateToolStatus);

router.get('/marketplace', protect, admin, getAdminMarketplace);
router.patch('/marketplace/:id/status', protect, admin, updateMarketplaceStatus);

export default router;

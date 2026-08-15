import express from 'express';
import { 
  getDashboardStats, getUsers, updateUserStatus, 
  getAdminCrops, updateCropStatus, forceUpdateCrop,
  getAdminLands, updateLandStatus,
  getAdminTools, updateToolStatus,
  getAdminMarketplace, updateMarketplaceStatus,
  getSubAdmins, createSubAdmin, assignSubAdminTask, updateTaskStatus
} from '../controllers/adminController.js';
import { protect, admin, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getUsers);
router.patch('/users/:id/status', protect, admin, updateUserStatus);

// Strict Super Admin Task Delegation Routes
router.get('/sub-admins', protect, admin, getSubAdmins);
router.post('/create-sub-admin', protect, superAdminOnly, createSubAdmin);
router.post('/assign-task', protect, superAdminOnly, assignSubAdminTask);
router.put('/update-task-status', protect, admin, updateTaskStatus);

router.get('/crops', protect, admin, getAdminCrops);
router.patch('/crops/:id/status', protect, admin, updateCropStatus);
router.patch('/crops/:id/force', protect, admin, forceUpdateCrop);

router.get('/lands', protect, admin, getAdminLands);
router.patch('/lands/:id/status', protect, admin, updateLandStatus);

router.get('/tools', protect, admin, getAdminTools);
router.patch('/tools/:id/status', protect, admin, updateToolStatus);

router.get('/marketplace', protect, admin, getAdminMarketplace);
router.patch('/marketplace/:id/status', protect, admin, updateMarketplaceStatus);

export default router;

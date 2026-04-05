import express from 'express';
import { 
  getMyPartnerships, 
  getAllPartnerships, 
  updatePartnershipBasic, 
  pushTask, 
  toggleTaskCompleted,
  pushExpense 
} from '../controllers/partnershipController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMyPartnerships);
router.patch('/:id/tasks/toggle', protect, toggleTaskCompleted);

// Admin exclusive routes for project control
router.get('/', protect, admin, getAllPartnerships);
router.patch('/:id/basic', protect, admin, updatePartnershipBasic);
router.post('/:id/tasks', protect, admin, pushTask);
router.post('/:id/expenses', protect, admin, pushExpense);

export default router;

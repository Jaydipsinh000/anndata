import express from 'express';
import { getTools, addTool } from '../controllers/toolController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTools);
router.post('/', protect, addTool);

export default router;

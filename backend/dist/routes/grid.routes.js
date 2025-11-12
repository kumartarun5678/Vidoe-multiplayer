import { Router } from 'express';
import { gridController } from '../controllers/grid.controller.js';
import { sessionValidation } from '../middleware/auth.middleware.js';
const router = Router();
router.get('/state', gridController.getGridState);
router.post('/update', sessionValidation, gridController.updateCell);
router.post('/reset', sessionValidation, gridController.resetGrid);
export { router as gridRoutes };

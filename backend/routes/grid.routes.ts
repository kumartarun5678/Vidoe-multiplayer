import { Router } from 'express';
import { gridController } from '../controllers/grid.controller.ts';
import { sessionValidation } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/state', gridController.getGridState);

router.post('/update', sessionValidation, gridController.updateCell);
router.post('/reset', sessionValidation, gridController.resetGrid);

export { router as gridRoutes };
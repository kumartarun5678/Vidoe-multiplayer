import { Router } from 'express';
import { playerController } from '../controllers/palyer.controller.js';

const router = Router();

router.get('/count', playerController.getOnlineCount);
router.get('/stats', playerController.getSessionStats);
router.get('/session/:sessionId', playerController.getSessionStatus);
router.get('/cooldown/:sessionId', playerController.getCooldownStatus);

export { router as playerRoutes };
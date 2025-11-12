import { Router } from 'express';
import { historyService } from '../services/history.service.js';
import ApiResponse from '../utils/api.response.js';
import ApiError from '../utils/api.error.js';
const router = Router();
router.get('/', (req, res) => {
    try {
        const updates = historyService.getUpdates();
        res.json(new ApiResponse(200, "History fetched successfully", true, updates));
    }
    catch (error) {
        res.status(500).json(new ApiError(500, 'Failed to fetch history', []));
    }
});
router.get('/grouped', (req, res) => {
    try {
        const grouped = historyService.getGroupedUpdates();
        res.json(new ApiResponse(200, "Grouped history fetched successfully", true, grouped));
    }
    catch (error) {
        res.status(500).json(new ApiError(500, 'Failed to fetch grouped history', []));
    }
});
router.get('/timeline', (req, res) => {
    try {
        const timeline = historyService.getTimeline();
        res.json(new ApiResponse(200, "Timeline fetched successfully", true, timeline));
    }
    catch (error) {
        res.status(500).json(new ApiError(500, 'Failed to fetch timeline', []));
    }
});
router.get('/stats', (req, res) => {
    try {
        const stats = historyService.getStats();
        res.json(new ApiResponse(200, "History stats fetched successfully", true, stats));
    }
    catch (error) {
        res.status(500).json(new ApiError(500, 'Failed to fetch history stats', []));
    }
});
export { router as historyRoutes };

import { Router, type Request } from 'express';
import { historyService } from '../services/history.service.js';
import ApiResponse from '../utils/api.response.js';
import ApiError from '../utils/api.error.js';

const router = Router();

const getRoomId = (req: Request) => {
  const room = typeof req.query.roomId === 'string' && req.query.roomId.trim() ? req.query.roomId : undefined;
  return room || 'room-1';
};

router.get('/', (req, res) => {
  try {
    const updates = historyService.getUpdates(getRoomId(req));
        res.json(new ApiResponse(200, "History fetched successfully", true, updates));
  } catch (error) {
    res.status(500).json(new ApiError(500, 'Failed to fetch history', []));
  }
});

router.get('/grouped', (req, res) => {
  try {
    const grouped = historyService.getGroupedUpdates(getRoomId(req));
    res.json(new ApiResponse(200, "Grouped history fetched successfully", true, grouped));
  } catch (error) {
    res.status(500).json(new ApiError(500, 'Failed to fetch grouped history', []));
  }
});

router.get('/timeline', (req, res) => {
  try {
    const timeline = historyService.getTimeline(getRoomId(req));
    res.json(new ApiResponse(200, "Timeline fetched successfully", true, timeline));
  } catch (error) {
    res.status(500).json(new ApiError(500, 'Failed to fetch timeline', []));
  }
});

router.get('/stats', (req, res) => {
  try {
    const stats = historyService.getStats(getRoomId(req));
    res.json(new ApiResponse(200, "History stats fetched successfully", true, stats));
  } catch (error) {
    res.status(500).json(new ApiError(500, 'Failed to fetch history stats', []));
  }
});

export { router as historyRoutes };
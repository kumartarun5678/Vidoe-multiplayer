import { Request, Response } from 'express';
import { playerService } from '../services/player.service.js';
import ApiResponse from '../utils/api.response.js';
import ApiError from '../utils/api.error.js';

export const playerController = {
  getOnlineCount: (req: Request, res: Response) => {
    try {
      const count = playerService.getOnlineCount();
      res.json(new ApiResponse(200, "Active players count retrieved successfully", true, {count}));
    } catch (error) {
      res.status(500).json(new ApiError(500, "Failed to get online player count", error));
    }
  },

  getSessionStatus: (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const status = playerService.getSessionStatus(sessionId);
      
      res.json(new ApiResponse(200, "Session status retrieved successfully", true, status));
    } catch (error) {
      res.status(500).json(new ApiError(500, "Failed to get session status", error));
    }
  },

  getSessionStats: (req: Request, res: Response) => {
    try {
      const stats = playerService.getSessionStats();
      res.json(new ApiResponse(200, "Session stats retrieved successfully", true, stats));
    } catch (error) {
      res.status(500).json(new ApiError(500, "Failed to get session stats", error));
    }
  },

   getCooldownStatus: (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const cooldownStatus = playerService.getCooldownStatus(sessionId);
      
      res.json(new ApiResponse(200,"Cooldown status retrieved successfully", true, cooldownStatus));
    } catch (error) {
      res.status(500).json(new ApiError(500, "Failed to get cooldown status", error));
    }
  }
};
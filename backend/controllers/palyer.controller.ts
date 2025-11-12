import { Request, Response } from 'express';
import { playerService } from '../services/player.service.js';

export const playerController = {
  getOnlineCount: (req: Request, res: Response) => {
    try {
      const count = playerService.getOnlineCount();
      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get player count'
      });
    }
  },

  getSessionStatus: (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const status = playerService.getSessionStatus(sessionId);
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get session status'
      });
    }
  },

  getSessionStats: (req: Request, res: Response) => {
    try {
      const stats = playerService.getSessionStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get session stats'
      });
    }
  }
};
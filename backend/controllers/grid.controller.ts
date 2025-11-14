import { Request, Response } from 'express';
import { gridService } from '../services/grid.service.js';
import { validationService } from '../middleware/validation.middleware.js';
import asyncHandler from '../utils/async.handler.js';
import ApiResponse from '../utils/api.response.js';
import ApiError from '../utils/api.error.js';

const resolveRoomId = (req: Request) => {
    const room = typeof req.query.roomId === 'string' && req.query.roomId.trim() ? req.query.roomId : undefined;
    return room || 'room-1';
};

export const gridController = {
    getGridState: asyncHandler(async (req: Request, res: Response) => {
        const roomId = resolveRoomId(req);
        const gridState = gridService.getGridState(roomId);
        res.json(
            new ApiResponse(200, "Grid fetched successfully", true, gridState)
        );
    }),

    updateCell: asyncHandler(async (req: Request, res: Response) => {
        const { x, y, char, sessionId } = req.body;
        const validation = validationService.validateCellUpdate(x, y, char, sessionId);
        if (!validation.isValid) {
            return res.status(400).json(
                new ApiError(400, validation.error, [validation])
            );
        }

        const updateResult = gridService.updateCell(x, y, char, sessionId);
        if (!updateResult.success) {
            return res.status(400).json(
                new ApiError(400, updateResult.error, [updateResult])
            );
        }

        res.json(updateResult);
    }),

    resetGrid: asyncHandler(async (req: Request, res: Response) => {
        gridService.resetGrid(resolveRoomId(req));
        res.json(
            new ApiResponse(200, "Grid reset successfully", true)
        );
    })
};

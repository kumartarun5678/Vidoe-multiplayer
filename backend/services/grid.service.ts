import { GridModel } from '../models/grid.model.js';
import { playerService } from './player.service.js';
import { historyService } from './history.service.js';
import { io } from '../app.js';
import type { RecordUpdate } from '../interface/history.interface.js';

const DEFAULT_ROOM_ID = 'room-1';

class GridService {
    private grids: Map<string, GridModel>;

    constructor () {
        this.grids = new Map();
    }

    private getOrCreateGrid(roomId: string): GridModel {
        if (!this.grids.has(roomId)) {
            this.grids.set(roomId, new GridModel());
        }
        return this.grids.get(roomId)!;
    }

    getGridState(roomId: string = DEFAULT_ROOM_ID) {
        return this.getOrCreateGrid(roomId).getGridState();
    }

    updateCell(x: number, y: number, char: string, sessionId: string) {
        const session = playerService.getSession(sessionId);
        if (!session) {
            return {
                success: false,
                error: 'Session not found',
                reason: 'session_not_found'
            };
        }

        const roomId = session.roomId || DEFAULT_ROOM_ID;
        const canUpdate = playerService.canUpdate(sessionId);
        if (!canUpdate.canUpdate) {
            return {
                success: false,
                error: 'Player cannot update at this time',
                reason: canUpdate.reason,
                timeRemaining: canUpdate.timeRemaining
            };
        }

        const grid = this.getOrCreateGrid(roomId);
        const currentCell = grid.getCell(x, y);
        const previousChar = currentCell?.char || ' ';
        const success = grid.updateCell(x, y, char, sessionId);
        if (!success) {
            return {
                success: false,
                error: 'Invalid cell coordinates or character'
            };
        }
        const updateData: RecordUpdate = {
            x,
            y,
            previousChar,
            newChar: char,
            sessionId,
            roomId
        };

        historyService.recordUpdate(roomId, updateData);
        playerService.markSubmitted(sessionId);
        const gridState = this.getGridState(roomId);
        io.to(roomId).emit('grid_updated', {
            type: 'cell_update',
            data: {
                x, y, char, sessionId,
                gridState,
                roomId
            }
        });

        return {
            success: true,
            data: {
                x, y, char,
                gridState,
                roomId
            }
        };
    }

    resetGrid(roomId: string = DEFAULT_ROOM_ID) {
        this.getOrCreateGrid(roomId).resetGrid();

        const gridState = this.getGridState(roomId);
        io.to(roomId).emit('grid_updated', {
            type: 'grid_reset',
            data: { gridState, roomId }
        });

        historyService.recordGridReset(roomId);
    }

    getGridSize() {
        return GridModel.GRID_SIZE;
    }
}

export const gridService = new GridService();
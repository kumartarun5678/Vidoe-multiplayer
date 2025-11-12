import { GridModel } from '../models/grid.model.js';
import { playerService } from './player.service.js';
import { historyService } from './history.service.js';
import { io } from '../app.js';
import type { RecordUpdate } from '../interface/history.interface.js';

class GridService {
    private gridModel: GridModel;

    constructor () {
        this.gridModel = new GridModel();
    }

    getGridState() {
        return this.gridModel.getGridState();
    }

    updateCell(x: number, y: number, char: string, sessionId: string) {
        const canUpdate = playerService.canUpdate(sessionId);
        if (!canUpdate.canUpdate) {
            return {
                success: false,
                error: 'Player cannot update at this time',
                reason: canUpdate.reason,
                timeRemaining: canUpdate.timeRemaining
            };
        }

        const currentCell = this.gridModel.getCell(x, y);
        const previousChar = currentCell?.char || ' ';
        const success = this.gridModel.updateCell(x, y, char, sessionId);
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
        };

        historyService.recordUpdate(x, y, previousChar, char, sessionId, updateData);
        playerService.markSubmitted(sessionId);
        const gridState = this.getGridState();
        io.emit('grid_updated', {
            type: 'cell_update',
            data: {
                x, y, char, sessionId,
                gridState
            }
        });

        return {
            success: true,
            data: {
                x, y, char,
                gridState
            }
        };
    }

    resetGrid() {
        this.gridModel.resetGrid();

        const gridState = this.getGridState();
        io.emit('grid_updated', {
            type: 'grid_reset',
            data: { gridState }
        });

        historyService.recordGridReset();
    }

    getGridSize() {
        return this.gridModel.getGridSize();
    }
}

export const gridService = new GridService();
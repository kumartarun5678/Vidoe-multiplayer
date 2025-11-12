import { Cell, GridState } from '../interface/grid.interface.js';
import { GRID_SIZE } from '../constants.js';

export class GridModel {
    private grid: GridState;
    static readonly GRID_SIZE = GRID_SIZE;  

    constructor () {
        this.grid = this.initializeGrid();
    }

    private initializeGrid(): GridState {
        const cells: Cell[][] = [];

        for (let x = 0; x < GridModel.GRID_SIZE; x++) {
            cells[x] = [];
            for (let y = 0; y < GridModel.GRID_SIZE; y++) {
                cells[x][y] = {
                    x,
                    y,
                    char: ' ', 
                    lastUpdatedBy: '',
                    lastUpdatedAt: new Date()
                };
            }
        }

        return {
            cells,
            lastUpdated: new Date(),
            totalUpdates: 0
        };
    }

    updateCell(x: number, y: number, char: string, sessionId: string): boolean {
        if (x < 0 || x >= GridModel.GRID_SIZE || y < 0 || y >= GridModel.GRID_SIZE) {
            return false;
        }
        if (char.length > 1) {
            return false;
        }
        this.grid.cells[x][y] = {
            x,
            y,
            char,
            lastUpdatedBy: sessionId,
            lastUpdatedAt: new Date()
        };

        this.grid.lastUpdated = new Date();
        this.grid.totalUpdates++;

        return true;
    }

    getCell(x: number, y: number): Cell | null {
        if (x < 0 || x >= GridModel.GRID_SIZE || y < 0 || y >= GridModel.GRID_SIZE) {
            return null;
        }
        return this.grid.cells[x][y];
    }

    getGridState(): GridState {
        return {
            ...this.grid,
            cells: this.grid.cells.map(row => [...row])
        };
    }

    getGridSize(): number {
        return GridModel.GRID_SIZE;
    }

    resetGrid(): void {
        this.grid = this.initializeGrid();
    }

    getUpdatedCells(): Cell[] {
        const updated: Cell[] = [];

        for (let x = 0; x < GridModel.GRID_SIZE; x++) {
            for (let y = 0; y < GridModel.GRID_SIZE; y++) {
                if (this.grid.cells[x][y].char !== ' ') {
                    updated.push(this.grid.cells[x][y]);
                }
            }
        }

        return updated;
    }
}
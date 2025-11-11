export interface Cell {
  x: number;
  y: number;
  char: string;
  lastUpdatedBy: string;
  lastUpdatedAt: Date;
}

export interface GridState {
  cells: Cell[][];
  lastUpdated: Date;
  totalUpdates: number;
}
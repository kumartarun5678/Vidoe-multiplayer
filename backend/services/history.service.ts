import { HistoryModel } from '../models/history.model.js';
import { GridUpdate, RecordUpdate } from '../interface/history.interface.js';

const DEFAULT_ROOM_ID = 'room-1';

class HistoryService {
  private historyModels: Map<string, HistoryModel>;

  constructor() {
    this.historyModels = new Map();
  }

  private getHistory(roomId: string = DEFAULT_ROOM_ID): HistoryModel {
    if (!this.historyModels.has(roomId)) {
      this.historyModels.set(roomId, new HistoryModel(roomId));
    }
    return this.historyModels.get(roomId)!;
  }

  recordUpdate(roomId: string, updateData: RecordUpdate): GridUpdate {
    return this.getHistory(roomId).recordUpdate(updateData);
  }

  getUpdates(roomId?: string) {
    return this.getHistory(roomId).getUpdates();
  }

  getUpdatesSince(timestamp: Date, roomId?: string) {
    return this.getHistory(roomId).getUpdatesSince(timestamp);
  }

  getGroupedUpdates(roomId?: string) {
    return this.getHistory(roomId).getGroupedUpdates();
  }

  getTimeline(roomId?: string) {
    return this.getHistory(roomId).getTimeline();
  }

  getStats(roomId?: string) {
    return this.getHistory(roomId).getStats();
  }

  recordGridReset(roomId?: string) {
    this.getHistory(roomId).recordUpdate({
      x: -1,
      y: -1,
      previousChar: 'GRID_RESET',
      newChar: 'GRID_RESET',
      sessionId: 'system',
      roomId: roomId || DEFAULT_ROOM_ID
    });
  }

  clearHistory(roomId?: string) {
    this.getHistory(roomId).clearHistory();
  }
}

export const historyService = new HistoryService();
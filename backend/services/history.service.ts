import { HistoryModel } from '../models/history.model.ts';
import { GridUpdate, RecordUpdate } from '../interface/history.interface.ts';

class HistoryService {
  private historyModel: HistoryModel;

  constructor() {
    this.historyModel = new HistoryModel();
  }

  recordUpdate(x: number, y: number, previousChar: string, char: string, sessionId: string, updateData: RecordUpdate): GridUpdate {
    return this.historyModel.recordUpdate(updateData);
  }

  getUpdates() {
    return this.historyModel.getUpdates();
  }

  getUpdatesSince(timestamp: Date) {
    return this.historyModel.getUpdatesSince(timestamp);
  }

  getGroupedUpdates() {
    return this.historyModel.getGroupedUpdates();
  }

  getTimeline() {
    return this.historyModel.getTimeline();
  }

  getStats() {
    return this.historyModel.getStats();
  }

  recordGridReset() {
    this.historyModel.recordUpdate({
      x: -1,
      y: -1,
      previousChar: 'GRID_RESET',
      newChar: 'GRID_RESET',
      sessionId: 'system'
    });
  }

  clearHistory() {
    this.historyModel.clearHistory();
  }
}

export const historyService = new HistoryService();
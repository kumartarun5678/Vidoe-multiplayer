import { HistoryModel } from '../models/history.model.js';
class HistoryService {
    historyModel;
    constructor() {
        this.historyModel = new HistoryModel();
    }
    recordUpdate(x, y, previousChar, char, sessionId, updateData) {
        return this.historyModel.recordUpdate(updateData);
    }
    getUpdates() {
        return this.historyModel.getUpdates();
    }
    getUpdatesSince(timestamp) {
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

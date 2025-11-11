import { GridUpdate, GroupedUpdate, RecordUpdate } from '../interface/history.interface.ts';
import { GROUPING_WINDOW } from '../constants.ts';

export class HistoryModel {
    private history: GridUpdate[] = [];
    private groupedUpdates: GroupedUpdate[] = [];
    private readonly GROUPING_WINDOW = GROUPING_WINDOW;

    recordUpdate(updateData: RecordUpdate): GridUpdate {
        const { x, y, previousChar, newChar, sessionId } = updateData;

        const update: GridUpdate = {
            id: this.generateUpdateId(),
            x,
            y,
            previousChar,
            newChar,
            sessionId,
            timestamp: new Date(),
        };

        this.history.push(update);
        this.groupUpdates();

        return update;
    }


    getUpdates(): GridUpdate[] {
        return [...this.history]; 
    }

    getUpdatesSince(timestamp: Date): GridUpdate[] {
        return this.history.filter(update => update.timestamp > timestamp);
    }

    getUpdatesBySession(sessionId: string): GridUpdate[] {
        return this.history.filter(update => update.sessionId === sessionId);
    }

    getUpdatesForCell(x: number, y: number): GridUpdate[] {
        return this.history.filter(update => update.x === x && update.y === y);
    }

    getGroupedUpdates(): GroupedUpdate[] {
        return [...this.groupedUpdates];
    }

    getTimeline(): { timestamp: Date; updates: GridUpdate[] }[] {
        const timeline: { timestamp: Date; updates: GridUpdate[] }[] = [];
        const sortedUpdates = [...this.history].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        let currentTime: Date | null = null;
        let currentUpdates: GridUpdate[] = [];

        for (const update of sortedUpdates) {
            if (!currentTime || update.timestamp.getTime() - currentTime.getTime() > this.GROUPING_WINDOW) {
                if (currentUpdates.length > 0) {
                    timeline.push({
                        timestamp: currentTime!,
                        updates: [...currentUpdates]
                    });
                }
                currentTime = update.timestamp;
                currentUpdates = [update];
            } else {
                currentUpdates.push(update);
            }
        }
        if (currentUpdates.length > 0) {
            timeline.push({
                timestamp: currentTime!,
                updates: currentUpdates
            });
        }

        return timeline;
    }

    clearHistory(): void {
        this.history = [];
        this.groupedUpdates = [];
    }

    getStats() {
        const totalUpdates = this.history.length;
        const uniqueSessions = new Set(this.history.map(update => update.sessionId)).size;
        const uniqueCells = new Set(this.history.map(update => `${update.x},${update.y}`)).size;
        const groupedCount = this.groupedUpdates.length;

        return {
            totalUpdates,
            uniqueSessions,
            uniqueCells,
            groupedCount,
            firstUpdate: this.history[0]?.timestamp || null,
            lastUpdate: this.history[this.history.length - 1]?.timestamp || null
        };
    }

    private groupUpdates(): void {
        const now = new Date();
        const recentUpdates = this.history.filter(
            update => now.getTime() - update.timestamp.getTime() <= this.GROUPING_WINDOW
        );

        if (recentUpdates.length === 0) return;
        const groups: Map<number, GridUpdate[]> = new Map(); 

        for (const update of recentUpdates) {
            const groupKey = Math.floor(update.timestamp.getTime() / this.GROUPING_WINDOW) * this.GROUPING_WINDOW;

            if (!groups.has(groupKey)) {
                groups.set(groupKey, []);
            }
            groups.get(groupKey)!.push(update);
        }

        this.groupedUpdates = Array.from(groups.entries()).map(([startTime, updates]) => {
            const sortedUpdates = updates.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

            return {
                id: `group_${startTime}`,
                updates: sortedUpdates,
                startTime: new Date(startTime),
                endTime: new Date(sortedUpdates[sortedUpdates.length - 1].timestamp.getTime()),
                sessionIds: Array.from(new Set(sortedUpdates.map(update => update.sessionId)))
            };
        });

        this.groupedUpdates.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }

    private generateUpdateId(): string {
        return `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
export interface GridUpdate {
    id: string;
    x: number;
    y: number;
    previousChar: string;
    newChar: string;
    sessionId: string;
    timestamp: Date;
}

export interface GroupedUpdate {
    id: string;
    updates: GridUpdate[];
    startTime: Date;
    endTime: Date;
    sessionIds: string[];
}

export interface HistoryState {
    updates: GridUpdate[];
    groupedUpdates: GroupedUpdate[];
    lastGroupedAt: Date;
}

export interface RecordUpdate {
    x: number,
    y: number,
    previousChar: string,
    newChar: string,
    sessionId: string
}
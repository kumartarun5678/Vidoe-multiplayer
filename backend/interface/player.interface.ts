export interface PlayerSession {
  sessionId: string;
  connectionId: string | null;
  roomId: string;
  hasSubmitted: boolean;
  cooldownUntil?: Date;
  lastActivity: Date;
  createdAt: Date;
}
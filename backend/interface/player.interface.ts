export interface PlayerSession {
  sessionId: string;
  connectionId: string;
  hasSubmitted: boolean;
  cooldownUntil?: Date;
  lastActivity: Date;
  createdAt: Date;
}
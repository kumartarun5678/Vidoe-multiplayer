export interface PlayerSession {
  sessionId: string;
  connectionId: string | null;
  hasSubmitted: boolean;
  cooldownUntil?: Date;
  lastActivity: Date;
  createdAt: Date;
}
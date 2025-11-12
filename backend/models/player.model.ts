import { PlayerSession } from '../interface/player.interface.js';
import { SESSION_TIMEOUT, COOLDOWN_DURATION } from '../constants.js';

export class PlayerModel {
  private sessions: Map<string, PlayerSession> = new Map();
  private readonly SESSION_TIMEOUT = SESSION_TIMEOUT;
  private readonly COOLDOWN_DURATION = COOLDOWN_DURATION;

  createSession(connectionId: string): PlayerSession {
    const sessionId = this.generateSessionId();
    
    const session: PlayerSession = {
      sessionId,
      connectionId,
      hasSubmitted: false,
      lastActivity: new Date(),
      createdAt: new Date()
    };

    this.sessions.set(sessionId, session);
    this.cleanupExpiredSessions();
    
    return session;
  }

  getSession(sessionId: string): PlayerSession | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
    return session;
  }

  getSessionByConnection(connectionId: string): PlayerSession | undefined {
    for (const session of this.sessions.values()) {
      if (session.connectionId === connectionId) {
        session.lastActivity = new Date();
        return session;
      }
    }
    return undefined;
  }

  canUpdate(sessionId: string): { canUpdate: boolean; reason?: string; timeRemaining?: number } {
    const session = this.getSession(sessionId);
    
    if (!session) {
      return { canUpdate: false, reason: 'session_not_found' };
    }

    if (session.hasSubmitted && session.cooldownUntil) {
      const now = new Date();
      if (now < session.cooldownUntil) {
        const timeRemaining = session.cooldownUntil.getTime() - now.getTime();
        return { 
          canUpdate: false, 
          reason: 'cooldown_active', 
          timeRemaining 
        };
      } else {
        session.hasSubmitted = false;
        session.cooldownUntil = undefined;
      }
    }

    return { canUpdate: true };
  }

  markSubmitted(sessionId: string): void {
    const session = this.getSession(sessionId);
    if (session) {
      session.hasSubmitted = true;
      session.cooldownUntil = new Date(Date.now() + this.COOLDOWN_DURATION);
      session.lastActivity = new Date();
    }
  }

  resetCooldown(sessionId: string): void {
    const session = this.getSession(sessionId);
    if (session) {
      session.hasSubmitted = false;
      session.cooldownUntil = undefined;
      session.lastActivity = new Date();
    }
  }

  removeSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  removeSessionByConnection(connectionId: string): boolean {
    const session = this.getSessionByConnection(connectionId);
    return session ? this.sessions.delete(session.sessionId) : false;
  }

  getOnlineCount(): number {
    this.cleanupExpiredSessions();
    return this.sessions.size;
  }

  getAllSessions(): PlayerSession[] {
    this.cleanupExpiredSessions();
    return Array.from(this.sessions.values());
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    
    for (const [sessionId, session] of this.sessions.entries()) {
      const timeSinceLastActivity = now.getTime() - session.lastActivity.getTime();
      if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
      }
    }
  }

  getSessionStats() {
    this.cleanupExpiredSessions();
    
    const total = this.sessions.size;
    const submitted = Array.from(this.sessions.values()).filter(s => s.hasSubmitted).length;
    const inCooldown = Array.from(this.sessions.values()).filter(s => s.cooldownUntil && new Date() < s.cooldownUntil).length;
    
    return { total, submitted, inCooldown };
  }
}
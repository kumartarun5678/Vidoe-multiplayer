import { PlayerModel } from '../models/player.model.js';
import { io } from '../app.js';

const ROOM_CAPACITY = 10;
const ROOM_PREFIX = 'room';

class PlayerService {
  private playerModel: PlayerModel;

  constructor () {
    this.playerModel = new PlayerModel();
  }

  createSession(connectionId: string, roomId?: string) {
    const targetRoom = roomId || this.getAvailableRoomId();
    const session = this.playerModel.createSession(connectionId, targetRoom);
    this.broadcastPlayerCount();
    return session;
  }

  removeSession(connectionId: string) {
    const session = this.playerModel.getSessionByConnection(connectionId);
    const hasActiveCooldown = session?.hasSubmitted &&
      session.cooldownUntil &&
      new Date() < session.cooldownUntil;

    if (hasActiveCooldown && session) {
      this.playerModel.detachSessionByConnection(connectionId);
      this.broadcastPlayerCount();
      return false;
    }

    const success = this.playerModel.removeSessionByConnection(connectionId);
    if (success) {
      this.broadcastPlayerCount();
    }
    return success;
  }

  getSession(sessionId: string) {
    return this.playerModel.getSession(sessionId);
  }

  getSessionByConnection(connectionId: string) {
    return this.playerModel.getSessionByConnection(connectionId);
  }

  canUpdate(sessionId: string) {
    return this.playerModel.canUpdate(sessionId);
  }

  markSubmitted(sessionId: string) {
    this.playerModel.markSubmitted(sessionId);
    this.broadcastPlayerCount();
  }

  resetCooldown(sessionId: string) {
    this.playerModel.resetCooldown(sessionId);
  }

  getOnlineCount() {
    return this.playerModel.getOnlineCount();
  }

  getSessionStatus(sessionId: string) {
    const session = this.getSession(sessionId);
    const canUpdate = this.canUpdate(sessionId);

    return {
      session,
      canUpdate
    };
  }

  getSessionStats() {
    return this.playerModel.getSessionStats();
  }

  private broadcastPlayerCount() {
    const count = this.getOnlineCount();
    io.emit('player_count_update', {
      type: 'player_count',
      data: { count }
    });
  }

  startCleanupInterval() {
    setInterval(() => {
      const previousCount = this.getOnlineCount();
      this.playerModel.getOnlineCount();
      const newCount = this.getOnlineCount();

      if (previousCount !== newCount) {
        this.broadcastPlayerCount();
      }
    }, 60000);
  }
  getCooldownStatus(sessionId: string): {
    canUpdate: boolean;
    timeRemaining?: number;
    cooldownEnd?: Date;
  } {
    const session = this.playerModel.getSession(sessionId);

    if (!session) {
      return { canUpdate: true };
    }
    if (session.hasSubmitted && session.cooldownUntil) {
      const now = new Date();
      if (now < session.cooldownUntil) {
        const timeRemaining = session.cooldownUntil.getTime() - now.getTime();
        return {
          canUpdate: false,
          timeRemaining,
          cooldownEnd: session.cooldownUntil
        };
      } else {
        session.hasSubmitted = false;
        session.cooldownUntil = undefined;
        return { canUpdate: true };
      }
    }

    return { canUpdate: true };
  }

  getAvailableRoomId(): string {
    const counts = this.playerModel.getActiveRoomCounts();
    let roomIndex = 1;
    while ((counts.get(`${ROOM_PREFIX}-${roomIndex}`) || 0) >= ROOM_CAPACITY) {
      roomIndex++;
    }
    return `${ROOM_PREFIX}-${roomIndex}`;
  }

}

export const playerService = new PlayerService();

playerService.startCleanupInterval();
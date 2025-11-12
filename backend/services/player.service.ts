import { PlayerModel } from '../models/player.model.js';
import { io } from '../app.js';

class PlayerService {
  private playerModel: PlayerModel;

  constructor() {
    this.playerModel = new PlayerModel();
  }

  createSession(connectionId: string) {
    const session = this.playerModel.createSession(connectionId);
    this.broadcastPlayerCount();
    return session;
  }

  removeSession(connectionId: string) {
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
}

export const playerService = new PlayerService();

playerService.startCleanupInterval();
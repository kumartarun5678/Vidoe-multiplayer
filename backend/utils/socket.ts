import { Server as SocketIOServer } from 'socket.io';
import { playerService } from '../services/player.service.js';
import { gridService } from '../services/grid.service.js';
import { SOCKET_EVENTS } from '../constants.js';

export const setupSocketHandlers = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    const savedSessionId = socket.handshake.auth.sessionId ||
      socket.handshake.headers.sessionid;

    let session;

    if (savedSessionId) {
      session = playerService.getSession(savedSessionId);
      if (!session) {
        session = playerService.createSession(socket.id);
      } else {
        session.connectionId = socket.id;
        session.lastActivity = new Date();
      }
    } else {
      session = playerService.createSession(socket.id);
    }

    socket.join(session.roomId);

    const cooldownStatus = playerService.getCooldownStatus(session.sessionId);

    socket.emit(SOCKET_EVENTS.SESSION_CREATED, {
      sessionId: session.sessionId,
      gridState: gridService.getGridState(session.roomId),
      playerCount: playerService.getOnlineCount(),
      cooldownStatus: cooldownStatus,
      roomId: session.roomId
    });

    socket.on(SOCKET_EVENTS.GET_COOLDOWN_STATUS, (data) => {
      const { sessionId } = data;
      const status = playerService.getCooldownStatus(sessionId);
      socket.emit(SOCKET_EVENTS.COOLDOWN_STATUS, status);
    });

    socket.on(SOCKET_EVENTS.CELL_UPDATE, (data) => {
      const { x, y, char, sessionId } = data;

      const playerSession = playerService.getSession(sessionId);
      if (!playerSession || playerSession.connectionId !== socket.id) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Invalid session' });
        return;
      }

      const result = gridService.updateCell(x, y, char, sessionId);

      if (result.success) {
        socket.emit(SOCKET_EVENTS.UPDATE_SUCCESS, result.data);
      } else {
        socket.emit(SOCKET_EVENTS.UPDATE_FAILED, result);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      playerService.removeSession(socket.id);
    });

    socket.on(SOCKET_EVENTS.CHECK_STATUS, (data) => {
      const { sessionId } = data;
      const status = playerService.getSessionStatus(sessionId);
      socket.emit(SOCKET_EVENTS.STATUS_UPDATE, status);
    });
  });
};
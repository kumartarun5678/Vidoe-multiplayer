export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://multiplayer-backend-jzxk.onrender.com';
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://multiplayer-backend-jzxk.onrender.com/api';

export const SOCKET_EVENTS = {
  // Client to Server
  CELL_UPDATE: 'cell_update',
  CHECK_STATUS: 'check_status',
  GET_COOLDOWN_STATUS: 'get_cooldown_status',
  
  // Server to Client
  SESSION_CREATED: 'session_created',
  GRID_UPDATED: 'grid_updated',
  PLAYER_COUNT_UPDATE: 'player_count_update',
  UPDATE_SUCCESS: 'update_success',
  UPDATE_FAILED: 'update_failed',
  STATUS_UPDATE: 'status_update',
    COOLDOWN_STATUS: 'cooldown_status',
  ERROR: 'error'
};

export const GRID_SIZE = 10;
export const COOLDOWN_DURATION = 60000; // 1 minute
export const DB_NAME = 'videoDB';
export const GRID_SIZE = 10;
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const COOLDOWN_DURATION = 60 * 1000; // 1 minute
export const GROUPING_WINDOW = 1000; // 1 second for grouping updates

export const SOCKET_EVENTS = {
  CELL_UPDATE: 'cell_update',
  CHECK_STATUS: 'check_status',
  
  SESSION_CREATED: 'session_created',
  GRID_UPDATED: 'grid_updated',
  PLAYER_COUNT_UPDATE: 'player_count_update',
  UPDATE_SUCCESS: 'update_success',
  UPDATE_FAILED: 'update_failed',
  STATUS_UPDATE: 'status_update',
  ERROR: 'error'
} ;
const numberFromEnv = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const DB_NAME = process.env.DB_NAME || 'game_database';
export const GRID_SIZE = numberFromEnv(process.env.GRID_SIZE, 10);
export const SESSION_TIMEOUT = numberFromEnv(process.env.SESSION_TIMEOUT_MS, 30 * 60 * 1000); // 30 minutes
export const COOLDOWN_DURATION = numberFromEnv(process.env.COOLDOWN_DURATION_MS, 60 * 1000); // 1 minute
export const GROUPING_WINDOW = numberFromEnv(process.env.GROUPING_WINDOW_MS, 1000); // 1 second for grouping updates

export const SOCKET_EVENTS = {
  CELL_UPDATE: 'cell_update',
  CHECK_STATUS: 'check_status',
  
  SESSION_CREATED: 'session_created',
  GRID_UPDATED: 'grid_updated',
  PLAYER_COUNT_UPDATE: 'player_count_update',
  UPDATE_SUCCESS: 'update_success',
  UPDATE_FAILED: 'update_failed',
  STATUS_UPDATE: 'status_update',
  GET_COOLDOWN_STATUS: 'get_cooldown_status',
  COOLDOWN_STATUS: 'cooldown_status',
  ERROR: 'error'
} ;
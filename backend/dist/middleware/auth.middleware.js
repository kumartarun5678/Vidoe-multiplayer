import { playerService } from '../services/player.service.js';
export const sessionValidation = (req, res, next) => {
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;
    if (!sessionId) {
        return res.status(401).json({
            success: false,
            error: 'Session ID is required'
        });
    }
    const session = playerService.getSession(sessionId);
    if (!session) {
        return res.status(401).json({
            success: false,
            error: 'Invalid session'
        });
    }
    req.session = session;
    next();
};

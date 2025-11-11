class ValidationService {
    validateCellUpdate(x: number, y: number, char: string, sessionId: string) {
        if (typeof x !== 'number' || typeof y !== 'number') {
            return { isValid: false, error: 'Coordinates must be numbers' };
        }
        if (x < 0 || x >= 10 || y < 0 || y >= 10) {
            return { isValid: false, error: 'Coordinates must be between 0 and 9' };
        }
        if (typeof char !== 'string') {
            return { isValid: false, error: 'Character must be a string' };
        }

        if (char.length > 1) {
            return { isValid: false, error: 'Character must be a single Unicode character' };
        }
        if (typeof sessionId !== 'string' || !sessionId) {
            return { isValid: false, error: 'Valid session ID is required' };
        }

        return { isValid: true };
    }

    validateSessionId(sessionId: string) {
        if (typeof sessionId !== 'string' || !sessionId) {
            return { isValid: false, error: 'Valid session ID is required' };
        }

        return { isValid: true };
    }
}

export const validationService = new ValidationService();
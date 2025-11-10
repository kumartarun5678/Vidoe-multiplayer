const asyncHandler = (fn: Function) => async (req: any, res: any, next: any) => {
    try {
        return await fn(req, res, next);
    } catch (err: any) {
        const statusCode = Number(err.code) ? err.code : 500;
        return res.status(statusCode).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
}

export default asyncHandler;
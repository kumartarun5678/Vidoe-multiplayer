const asyncHandler = (fn) => async (req, res, next) => {
    try {
        return await fn(req, res, next);
    }
    catch (err) {
        const statusCode = Number(err.code) ? err.code : 500;
        return res.status(statusCode).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};
export default asyncHandler;

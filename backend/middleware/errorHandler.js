function errorHandler(err, _req, res, _next) {
    console.error('[Error]', err.stack || err.message || err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal server error' : err.message,
    });
}

module.exports = errorHandler;

// asyncHandler is a wrapper for async functions that catch errors and pass them to the next middleware
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// middleware/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
    // Log the error (you can use a logging library like Winston or Morgan)
    console.error(err.stack);

    // Set the response status code
    const statusCode = err.statusCode || 500; // Default to 500 if no status code is set

    // Send the error response
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error', // Default message
        // Optionally include stack trace in development mode
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorMiddleware;
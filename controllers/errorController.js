
const devErrors = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error
    })
}

const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || "error"
   
    if (process.env.NODE_ENV === "Development") {
        devErrors(error, res)
    }
}

module.exports = globalErrorHandler
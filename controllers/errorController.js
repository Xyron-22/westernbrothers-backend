
//function to execute for dev error information only when in development mode
const devErrors = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error
    })
}

//golbal express error handler where all the error caught in express is passed to this middleware
const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || "error"
   
    if (process.env.NODE_ENV === "Development") {
        devErrors(error, res)
    }
}

module.exports = globalErrorHandler
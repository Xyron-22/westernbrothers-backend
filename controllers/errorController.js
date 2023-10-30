
//function to execute for dev error information only when in development mode
const devErrors = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error
    })
}

//function to execute for prod error information only when in production mode
const prodErrors = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    })
}

//golbal express error handler where all the error caught in express is passed to this middleware
const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || "error"
   
    if (process.env.NODE_ENV === "Development") {
        devErrors(error, res)
    } else {
        prodErrors(error, res)
    }
}

module.exports = globalErrorHandler
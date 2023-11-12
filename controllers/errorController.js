
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

//function for handling duplicate keys errors
const errorHandlerForDuplicateKeys = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: "Some of the fields must be unique"
    })
}

//function for handling null field errors
const errorHandlerForNullFields = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: "Some of the fields are required"
    })
}

//function for handling database connection timeout
const errorHandlerForDBConnectionTimeOut = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: "Connection timeout, please try again"
    })
}

//golbal express error handler where all the error caught in express is passed to this middleware
const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || "error"
   
    if (process.env.NODE_ENV === "Development") {
        devErrors(error, res)
    } else {
        if (error.errno === 1062) {
            errorHandlerForDuplicateKeys(error, res)
        } else if (error.errno === 1048) {
            errorHandlerForNullFields(error, res)
        } else if (error.errno == -4077) {
            errorHandlerForDBConnectionTimeOut(error, res)
        } else {
            prodErrors(error, res)
        }
    }
}

module.exports = globalErrorHandler
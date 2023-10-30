const connection = require("../index");
const CustomError = require("../utils/customErrorHandler");

//route handlers for getting all the account records
const getAllAccountRecords = (req, res, next) => {
    const q = process.env.QUERY_ACCOUNT
    connection.query(q, (error, result, fields) => {
        if (error) return next(new CustomError(error.message, 500))
        res.status(200).json({
            status: "success",
            data: result
        })
    })
}

//use this route instead for faster retrieval of data instead of retrieving all the records to the client
//route handler for getting all account based on DSP
const getAccountBasedOnDsp = (req, res, next) => {
    const {dsp} = req.params;
    const q = process.env.QUERY_ACCOUNT_BASED_ON_DSP
    connection.query(q, [dsp], (err, result, fields) => {
        if (err) return next(err)
        if (!result[0]) return next(new CustomError("Invalid DSP input", 400))
        res.status(200).json({
        status: "success",
        data: result
        })
    })
}

module.exports = {getAllAccountRecords, getAccountBasedOnDsp}
const connection = require("../index");
const CustomError = require("../utils/customErrorHandler");

//route handlers for getting all the account records
const getAllAccountRecords = (req, res, next) => {
    const q = process.env.QUERY_ACCOUNT //
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
    if (!dsp) return next(new CustomError("Please select a DSP", 400))
    const q = process.env.QUERY_ACCOUNT_BASED_ON_DSP//
    connection.query(q, [dsp], (err, result, fields) => {
        if (err) return next(err)
        res.status(200).json({
        status: "success",
        data: result
        })
    })
}

//route handler for inserting an account record
const insertRecordInAccountTable = (req, res, next) => {
    const {customerNumber, accountName, location, dsp} = req.body
    if (!customerNumber || !accountName || !location || !dsp) return next(new CustomError("All fields are required", 400))
    const q = process.env.INSERT_ACCOUNT//
    const values = [customerNumber, accountName, location, dsp]
    connection.query(q, [values], (err, result, fields) => {
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: result
        })
    })
}

//route handler for deleting an account record
const deleteRecordInAccountTable = (req, res, next) => {
    const {id} = req.params;
    if (!id) return next(new CustomError("No ID attached", 400))
    const q = process.env.DELETE_ACCOUNT//
    connection.query(q, [id], (err, result, fields) => {
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: result
        })
    })
}

module.exports = {getAllAccountRecords, getAccountBasedOnDsp, insertRecordInAccountTable, deleteRecordInAccountTable}
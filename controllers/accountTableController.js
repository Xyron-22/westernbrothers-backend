const createConnection = require("../index");
const CustomError = require("../utils/customErrorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

//route handlers for getting all the account records //refactored to using promised pool
const getAllAccountRecords = asyncErrorHandler(async (req, res, next) => {
    const q = "SELECT * FROM `account` ORDER BY account_id ASC"
    const connection = createConnection()
    connection.execute(q, (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }
        connection.end()
        res.status(200).json({
            status: "success",
            data: query_result
        })
    })       
})

//use this route instead for faster retrieval of data instead of retrieving all the records to the client
//route handler for getting all account based on DSP //refactored to using promised pool
const getAccountBasedOnDsp = asyncErrorHandler(async (req, res, next) => {
    const {dsp} = req.params;
    if (!dsp) return next(new CustomError("Please select a DSP", 400))
    const q = "SELECT account_id, account_name, location FROM `account` WHERE dsp = ? ORDER BY account_id ASC"
    const connection = createConnection()
    connection.execute(q, [dsp], (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }
        connection.end()
        res.status(200).json({
        status: "success",
        data: query_result
        })
    })       
})

//route handler for inserting an account record //refactored to using promised pool
const insertRecordInAccountTable = asyncErrorHandler(async (req, res, next) => {
    const {customerNumber, accountName, location, dsp} = req.body
    if (!customerNumber || !accountName || !location || !dsp) return next(new CustomError("All fields are required", 400))
    const q = "INSERT INTO `account` (customer_number, account_name, location, dsp) VALUES (?)"
    const values = [customerNumber, accountName, location, dsp]
    const connection = createConnection()
    connection.query(q, [values], (err, query_result, fields) => { //changed to query
        if (err) {
            connection.end()
            return next(err)
        }
        connection.end()
        res.status(200).json({
            status: "success",
            data: query_result
        })
    })
})

//route handler for deleting an account record //refactored to using promised pool
const deleteRecordInAccountTable = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!id) return next(new CustomError("No ID attached", 400))
    const q = "DELETE FROM `account` WHERE account_id = ?"
    const connection = createConnection()
    connection.execute(q, [id], (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }
        connection.end()
        res.status(200).json({
            status: "success",
            data: query_result
        })
    })
})

module.exports = {getAllAccountRecords, getAccountBasedOnDsp, insertRecordInAccountTable, deleteRecordInAccountTable}
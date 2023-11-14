const pool = require("../index");
const promisePool = pool.promise();
const CustomError = require("../utils/customErrorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const checkMySQLConnection = require("../utils/checkMySQLConnection");

//route handlers for getting all the account records //refactored to using promised pool
const getAllAccountRecords = asyncErrorHandler(async (req, res, next) => {
    await checkMySQLConnection(next)
    const q = process.env.QUERY_ACCOUNT //
    const [query_result, fields, err] = await promisePool.query(q)
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: query_result
        })
})

//use this route instead for faster retrieval of data instead of retrieving all the records to the client
//route handler for getting all account based on DSP //refactored to using promised pool
const getAccountBasedOnDsp = asyncErrorHandler(async (req, res, next) => {
    await checkMySQLConnection(next)
    const {dsp} = req.params;
    if (!dsp) return next(new CustomError("Please select a DSP", 400))
    const q = process.env.QUERY_ACCOUNT_BASED_ON_DSP//
    const [query_result, fields, err] = await promisePool.query(q, [dsp])
        if (err) return next(err)
        res.status(200).json({
        status: "success",
        data: query_result
        })
})

//route handler for inserting an account record //refactored to using promised pool
const insertRecordInAccountTable = asyncErrorHandler(async (req, res, next) => {
    await checkMySQLConnection(next)
    const {customerNumber, accountName, location, dsp} = req.body
    if (!customerNumber || !accountName || !location || !dsp) return next(new CustomError("All fields are required", 400))
    const q = process.env.INSERT_ACCOUNT//
    const values = [customerNumber, accountName, location, dsp]
    const [query_result, fields, err] = await promisePool.query(q, [values])
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: query_result
        })
})

//route handler for deleting an account record //refactored to using promised pool
const deleteRecordInAccountTable = asyncErrorHandler(async (req, res, next) => {
    await checkMySQLConnection(next)
    const {id} = req.params;
    if (!id) return next(new CustomError("No ID attached", 400))
    const q = process.env.DELETE_ACCOUNT//
    const [query_result, fields, err] = await promisePool.query(q, [id])
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: query_result
        })
})

module.exports = {getAllAccountRecords, getAccountBasedOnDsp, insertRecordInAccountTable, deleteRecordInAccountTable}
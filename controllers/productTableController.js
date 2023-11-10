const connection = require("../index");
const CustomError = require("../utils/customErrorHandler");

//route handler for getting all the products records
const getAllProductRecords = (req, res, next) => {
    const q = process.env.QUERY_PRODUCT//
    connection.query(q, (err, result, fields) => {
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: result
        })
    })
}

//route handler for inserting product record
const insertRecordInProductTable = (req, res, next) => {
    const {matCode, matDescription, productFamily} = req.body
    const q = process.env.INSERT_PRODUCT//
    const values = [matCode, matDescription, productFamily || null]
    connection.query(q, [values], (err, result, fields) => {
        if (err) return next (err)
        res.status(200).json({
            status: "success",
            data: result
        })
    })
}

//route handler for deleting product record
const deleteRecordInProductTable = (req, res, next) => {
    const {id} = req.params;
    if (!id) return next(new CustomError("No ID attached", 400))
    const q = process.env.DELETE_PRODUCT//
    connection.query(q, [id], (err, result, fields) => {
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: result
        })
    })
}

module.exports = {getAllProductRecords, insertRecordInProductTable, deleteRecordInProductTable}
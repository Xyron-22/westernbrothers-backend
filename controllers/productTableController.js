const createConnection = require("../index");
const CustomError = require("../utils/customErrorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

//route handler for getting all the products records //refactored to using promised pool
const getAllProductRecords = asyncErrorHandler(async (req, res, next) => {
    const q = "SELECT * FROM `product` ORDER BY product_id ASC"
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

//route handler for inserting product record //refactored to using promised pool
const insertRecordInProductTable = asyncErrorHandler(async (req, res, next) => {
    const {matCode, matDescription, productFamily, volume} = req.body
    const q = "INSERT INTO `product` (mat_code, mat_description, product_family, uom) VALUES (?)"
    const values = [matCode, matDescription, productFamily || null, volume]
    const connection = createConnection()
    connection.query(q, [values], (err, query_result, fields) => { //changed to query
        if (err) {
            connection.end()
            return next (err)
        }
        connection.end()
        res.status(200).json({
            status: "success",
            data: query_result
        })
    })
})

//route handler for deleting product record //refactored to using promised pool
const deleteRecordInProductTable = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!id) return next(new CustomError("No ID attached", 400))
    const q = "DELETE FROM `product` WHERE product_id = ?"
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

module.exports = {getAllProductRecords, insertRecordInProductTable, deleteRecordInProductTable}
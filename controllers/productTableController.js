const createConnection = require("../index");
const CustomError = require("../utils/customErrorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

//route handler for getting all the products records //refactored to using promised pool
const getAllProductRecords = asyncErrorHandler(async (req, res, next) => {
    const q = "SELECT * FROM `product` ORDER BY product_id DESC"
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
    const {matCode, matDescription, productFamily, volume, stocks} = req.body
    const q = "INSERT INTO `product` (mat_code, mat_description, product_family, uom, stocks) VALUES (?)"
    const values = [matCode, matDescription, productFamily || null, volume, stocks]
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

//route handler for updating number of stocks in product table
const updateStocksRecordInProductTable = asyncErrorHandler(async (req, res, next) => {
    const {product_id, stocks} = req.body
    if (!product_id || !stocks) return next(new CustomError("All fields are required", 400))
    const q = "UPDATE `product` SET stocks = ? WHERE product_id = ?"
    const connection = createConnection()
    connection.execute(q, [stocks, product_id], (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }
        connection.end()
        res.status(200).json({
            status: "success",
            message: "stocks updated successfully"
        })
    })
})

//route handler for deleting selected products
const deleteSelectedProductsInProductTable = asyncErrorHandler(async (req, res, next) => {
    const {data} = req.body
    const q = "DELETE FROM `product` WHERE product_id IN (?)"
    const connection = createConnection()
    connection.query(q, [data], (err, query_result, fields) => {
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

//router handler for updating a product record
const updateAProductRecord = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params
    const {mat_description, product_family, uom, stocks} = req.body
    if (!id || !mat_description || !product_family || !uom || !stocks) return next(new CustomError("Some fields are missing", 400))
    const q = "UPDATE `product` SET mat_description = ?, product_family = ?, uom = ?, stocks = ? WHERE product_id = ?"
    const connection = createConnection()
    connection.execute(q, [mat_description, product_family, uom, stocks, id], (err, query_result, fields) => {
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

module.exports = {getAllProductRecords, insertRecordInProductTable, deleteRecordInProductTable, updateStocksRecordInProductTable, deleteSelectedProductsInProductTable, updateAProductRecord}
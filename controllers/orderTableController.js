const createConnection = require("../index");
const CustomError = require("../utils/customErrorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

//route handler for inserting new record/s for order table //refactored to using promised pool
const insertRecordInOrderTable = asyncErrorHandler(async (req, res, next) => {
    const {orderDate, accountId, customerName, tinNumber, contactNumber, term, products, remarksFreebiesConcern, deliveryDate} = req.body
    const q = process.env.INSERT_ORDER//
    const values = products.map(({productId, quantity, price}) => {
        return [orderDate, accountId, productId, customerName, tinNumber, contactNumber, term, remarksFreebiesConcern, deliveryDate, quantity, price]
    })

    const connection = createConnection()
    connection.query(q, [values], (err, query_result, fields) => { //changed to query
        if (err) {
            connection.end()
            return next(err)
        }
        connection.end()
        res.status(200).json({
            status: "success",
            data: query_result,
        })
    })
})

//route handler for getting all of the records in order table, join with the product and account table //refactored to using promised pool
const getAllOrderRecords = asyncErrorHandler(async (req, res, next) => {
    const q = process.env.QUERY_ORDER//
    const connection = createConnection()
    connection.execute(q, (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }
        connection.end()
        res.status(200).json({
            status: "success",
            data: query_result,
        })
    })       
})

//route handler for deleting a record in order table //refactored to using promised pool
const deleteRecordInOrderTable = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!id) return next(new CustomError("No ID attached", 400))
    const q = process.env.DELETE_ORDER//
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

module.exports = {insertRecordInOrderTable, getAllOrderRecords, deleteRecordInOrderTable}
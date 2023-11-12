const pool = require("../index");
const promisePool = pool.promise();
const CustomError = require("../utils/customErrorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

//route handler for inserting new record/s for order table //refactored to using promised pool
const insertRecordInOrderTable = asyncErrorHandler(async (req, res, next) => {
    const {orderDate, accountId, customerName, tinNumber, contactNumber, term, products, remarksFreebiesConcern, deliveryDate} = req.body
    const q = process.env.INSERT_ORDER//
    const values = products.map(({productId, quantity, price}) => {
        return [orderDate, accountId, productId, customerName, tinNumber, contactNumber, term, remarksFreebiesConcern, deliveryDate, quantity, price]
    })

    const [query_result, fields, err] = await promisePool.query(q, [values])
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: query_result,
        })
})

//route handler for getting all of the records in order table, join with the product and account table //refactored to using promised pool
const getAllOrderRecords = asyncErrorHandler(async (req, res, next) => {
    const q = process.env.QUERY_ORDER//
    const [query_result, fields, err] = await promisePool.query(q)
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: query_result,
        })
})

//route handler for deleting a record in order table //refactored to using promised pool
const deleteRecordInOrderTable = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!id) return next(new CustomError("No ID attached", 400))
    const q = process.env.DELETE_ORDER//
    const [query_result, fields, err] = await promisePool.query(q, [id])
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: query_result
        })
})

module.exports = {insertRecordInOrderTable, getAllOrderRecords, deleteRecordInOrderTable}
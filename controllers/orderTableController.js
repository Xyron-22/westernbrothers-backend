const mockData = require("../mockData");
const connection = require("../index");
const CustomError = require("../utils/customErrorHandler");

//route handler for inserting new record/s for order table
const insertRecordInOrderTable = (req, res, next) => {
    const {orderDate, accountId, customerName, tinNumber, contactNumber, terms, products, remarksFreebiesConcern, deliveryDate} = mockData
    const q = process.env.INSERT_ORDER
    const values = products.map(({product_id, quantity, price}) => {
        return [orderDate, accountId, product_id, customerName, tinNumber, contactNumber, terms, remarksFreebiesConcern, deliveryDate, quantity, price]
    })

    connection.query(q, [values], (err, result, fields) => {
        if (err) return next(new CustomError(err.message, 400))
        res.status(200).json({
            status: "success",
            data: result,
        })
    })
}

//route handler for getting all of the records in order table, join with the product and account table
const getAllOrderRecords = (req, res, next) => {
    const q = process.env.QUERY_ORDER
    connection.query(q, (err, results, fields) => {
        if (err) return next(new CustomError(err.message, 500))
        if (!results[0]) return next(new CustomError("No records found", 404))
        res.status(200).json({
            status: "success",
            data: results,
        })
    })
}

module.exports = {insertRecordInOrderTable, getAllOrderRecords}
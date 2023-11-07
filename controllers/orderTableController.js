const connection = require("../index");
const CustomError = require("../utils/customErrorHandler");

//route handler for inserting new record/s for order table
const insertRecordInOrderTable = (req, res, next) => {
    const {orderDate, accountId, customerName, tinNumber, contactNumber, term, products, remarksFreebiesConcern, deliveryDate} = req.body
    // console.log(req.body)
    const q = process.env.INSERT_ORDER
    const values = products.map(({productId, quantity, price}) => {
        return [orderDate, accountId, productId, customerName, tinNumber, contactNumber, term, remarksFreebiesConcern, deliveryDate, quantity, price]
    })

    connection.query(q, [values], (err, result, fields) => {
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: result,
        })
    })
}

//route handler for getting all of the records in order table, join with the product and account table
const getAllOrderRecords = (req, res, next) => {
    const q = process.env.QUERY_ORDER//order by added
    connection.query(q, (err, results, fields) => {
        if (err) return next(err)
        // if (!results[0]) return next(new CustomError("No records found", 404))
        res.status(200).json({
            status: "success",
            data: results,
        })
    })
}

//route handler for deleting a record in order table
const deleteRecordInOrderTable = (req, res, next) => {
    const {id} = req.params;
    if (!id) return next(new CustomError("No ID attached", 400))
    const q = process.env.DELETE_ORDER
    connection.query(q, [id], (err, result, fields) => {
        if (err) return next(err)
        res.status(200).json({
            status: "success",
            data: result
        })
    })
}

module.exports = {insertRecordInOrderTable, getAllOrderRecords, deleteRecordInOrderTable}
const connection = require("../index");
const CustomError = require("../utils/customErrorHandler");

//route handler for getting all the products records
const getAllProductRecords = (req, res, next) => {
    const q = process.env.QUERY_PRODUCT
    connection.query(q, (err, result, fields) => {
        if (err) return next(new CustomError(err.message, 500))
        res.status(200).json({
            status: "success",
            data: result
        })
    })
}

module.exports = {getAllProductRecords}
const connection = require("../index");
const CustomError = require("../utils/customErrorHandler");

//route handler for getting all the products records
const getAllProductRecords = (req, res, next) => {
    const q = process.env.QUERY_PRODUCT//order by added
    connection.query(q, (err, result, fields) => {
        if (err) return next(err)
        if (!result[0]) return next(new CustomError("No records found", 404))
        res.status(200).json({
            status: "success",
            data: result
        })
    })
}

module.exports = {getAllProductRecords}
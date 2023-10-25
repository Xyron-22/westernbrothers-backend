const connection = require("../index");
const CustomError = require("../utils/customErrorHandler");

const getAllAccountRecords = (req, res, next) => {
    const q = process.env.QUERY_ACCOUNT
    connection.query(q, (error, result, fields) => {
        if (error) return next(new CustomError(error.message, 500))
        res.status(200).json({
            status: "success",
            data: result
        })
    })
}

module.exports = {getAllAccountRecords}
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customErrorHandler");
const createConnection = require("../index");

//middleware for checking if a user is an authorized personnel to access a route
const checkIfAuthorized = asyncErrorHandler(async (req, res, next) => {
    if (req.body.decodedToken.role !== process.env.AUTHORIZED_ROLE) return next(new CustomError("Unauthorized action", 401))
    next()
})

//middleware for checking if a user is logged in as authorized or unauthorized and sets the req.body.role
const checkIfLoggedIn = (req, res, next) => {
    const {authorization} = req.headers
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1]
    }
    if (!token) return next(new CustomError("Your are not logged in", 400))
    const decodedJWTToken = jwt.verify(token, process.env.JSON_SECRET_STRING)
    req.body.decodedToken = decodedJWTToken
    next()
}

//middleware for checking if a user changed password recently //refactored to use promised pool
const checkIfChangedPassRecently = asyncErrorHandler(async (req, res, next) => {
    const {decodedToken} = req.body
    const q = process.env.QUERY_USER_WITH_AUTH_ID//
    const connection = createConnection()
    connection.execute(q, [decodedToken.id], (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }
        if (query_result.length === 0) {
            connection.end()
            return next(new CustomError("No user found", 404))
        }
        if (!query_result[0].password_changed_at || parseInt(query_result[0].password_changed_at / 1000, 10) < decodedToken.iat) {
            connection.end()
            next()
        } else {
            connection.end()
            next(new CustomError("Password changed recently, you have to log in again", 400))
        }
    })       
})

module.exports = {checkIfAuthorized, checkIfLoggedIn, checkIfChangedPassRecently}
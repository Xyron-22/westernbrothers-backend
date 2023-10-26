const connection = require("../index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customErrorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const jwtSign = (id, role) => {
    return jwt.sign({id, role}, process.env.JSON_SECRET_STRING, {
        expiresIn: process.env.JSON_TOKEN_EXPIRATION
    })
}

//route handler for signing up a user or admin
const signUp = asyncErrorHandler(async (req, res, next) => {
    const {username, password, role} = req.body
    const hashedPassword = await bcrypt.hash(password, 5)
    const q = "INSERT INTO `auth` (username, password, role) VALUES (?)"
    const values = [username, hashedPassword, role]
    connection.query(q, [values], (err, result ,fields) => {
        if (err) return next(err)
        const token = jwtSign(result.insertId, role)
        res.status(200).json({
            status: "success",
            data: result,
            token
        })
    })
})

//route handler for signing in a user 
const signIn = asyncErrorHandler(async (req, res, next) => {
    const {username, password} = req.body
    if (!username || !password) return next(new CustomError("Username and Password is required", 401))
    const q = "SELECT * FROM `auth` WHERE username = (?)"
    const value = [username]
    connection.query(q, [value], async (err, result, fields) => {
        if (err) return next(err)
        if (result[0] && await bcrypt.compare(password, result[0].password)) {
            const token = jwtSign(result[0].auth_id, result[0].role)
            res.status(200).json({
                status: "success",
                token
            })
        } else if (!result[0]) {
            return next(new CustomError("Username does not exist", 401))
        } else {
            return next(new CustomError("Password does not match", 401))
        }
    })
})

module.exports = {signUp, signIn}
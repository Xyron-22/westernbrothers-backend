const createConnection = require("../index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const CustomError = require("../utils/customErrorHandler");
const sendEmail = require("../utils/email");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const jwtSign = (id, role) => {
    return jwt.sign({id, role}, process.env.JSON_SECRET_STRING, {
        expiresIn: process.env.JSON_TOKEN_EXPIRATION
    })
}

//route handler for signing up an admin account //refactored to using the promised pool
const signUp = asyncErrorHandler(async (req, res, next) => {
    const {email, password, confirmPassword, role} = req.body
    if (!email || !password || !confirmPassword || !role) return next(new CustomError("All fields are required", 400))
    if (password !== confirmPassword) return next(new CustomError("Password and Confirm Password does not match", 400))
    if (role.toLowerCase() === process.env.AUTHORIZED_ROLE || role.toLowerCase() === process.env.UNAUTHORIZED_ROLE) {
        const hashedPassword = await bcrypt.hash(password, 5)
        const q = "INSERT INTO `auth` (email, password, role) VALUES (?)"
        const values = [email, hashedPassword, role.toLowerCase()]
        const connection = createConnection()
        connection.query(q, [values], (err, query_result, fields) => { //changed to query
            if (err) {
                connection.end()
                return next(err)
            }
            const token = jwtSign(query_result.insertId, role.toLowerCase())
            connection.end()
            res.status(200).json({
                status: "success",
                data: query_result,
                token
            })
        }) 
    } else {
        next(new CustomError("Invalid role input", 400))
    }
})

//route handler for signing in a user //refactored to using promised pool
const signIn = asyncErrorHandler(async (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password) return next(new CustomError("Email and Password is required", 400))
    const q = "SELECT * FROM `auth` WHERE email = ?"
    const connection = createConnection()
    connection.execute(q, [email], async (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }
        if (query_result.length > 0 && await bcrypt.compare(password, query_result[0].password)) {
            const token = jwtSign(query_result[0].auth_id, query_result[0].role)
            connection.end()
            res.status(200).json({
                status: "success",
                token
            })
        } else if (query_result.length === 0) {
            connection.end()
            return next (new CustomError("Email does not exist", 400))
        } else {
            connection.end()
            return next (new CustomError("Password incorrect", 400))
        }
    })
})

//route handler for forgot password //refactored to using promised pool
const forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const {email} = req.body
    if (!email) return next(new CustomError("Email is required", 400))
    const q = "UPDATE `auth` SET password_reset_token = ?, reset_token_expired = ? WHERE email = ?"
    const resetToken = crypto.randomBytes(32).toString("hex")
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const resetTokenExpired = Date.now() + 10 * 60 * 1000;
    const connection = createConnection()
    connection.execute(q, [passwordResetToken, resetTokenExpired, email], async (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }
        if(query_result.affectedRows !== 1) {
            connection.end()
            return next (new CustomError("Email not found", 400))
        }
        const resetUrl = `${process.env.FRONTEND_URL}/auth/resetpassword/${resetToken}`
        const message = `We have received a password reset request. Please use the link below to reset your password \n\n${resetUrl}\n\nThis link will only be available for 10 minutes`
        try {
            await sendEmail({
                email: email,
                subject: "Password reset link",
                message
            })
            connection.end()
                res.status(200).json({
                status: "success",
                message: "password reset link sent to the user"
            })
        } catch (error) {
            connection.execute(q, [null, null, email], (err, query_result, fields) => {
                if (err) {
                    connection.end()
                    return next(err)
                }
                connection.end()
                return next(new CustomError("There was an error sending password reset email, Please try again later", 500))
            })
        }
    })                          
})

//router handler for resetting the password //refactored to using promised pool
const resetPassword = asyncErrorHandler(async (req, res, next) => {
    const {password, confirmPassword} = req.body
    const {token} = req.params
    if(!password || !confirmPassword) return next(new CustomError("Password and Confirm password field is required", 400))
    if(password !== confirmPassword) return next(new CustomError("Password and Confirm password does not match", 400))
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const hashedPassword = await bcrypt.hash(password, 5)
    const q = "UPDATE `auth` SET password = ?, password_reset_token = ?, reset_token_expired = ?, password_changed_at = ? WHERE password_reset_token = ? AND reset_token_expired > ?"
    const values = [hashedPassword, null, null, Date.now(), hashedToken, Date.now()]
    const connection = createConnection()
    connection.execute(q, values, (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next (err)
        }
        if (query_result.affectedRows !== 1) {
            connection.end()
            return next (new CustomError("Invalid is invalid or has expired!", 400))
        }
        connection.end()
        res.status(200).json({
            status: "success",
            message: "Password successfully changed"
        })
    })
}
)

module.exports = {signUp, signIn, forgotPassword, resetPassword}
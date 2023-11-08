const connection = require("../index");
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

//route handler for signing up an admin account
const signUp = asyncErrorHandler(async (req, res, next) => {
    const {email, password, confirmPassword, role} = req.body
    if (!email || !password || !confirmPassword || !role) return next(new CustomError("All fields are required", 400))
    if (password !== confirmPassword) return next(new CustomError("Password and Confirm Password does not match", 400))
    if (role.toLowerCase() === process.env.AUTHORIZED_ROLE || role.toLowerCase() === process.env.UNAUTHORIZED_ROLE) {
        const hashedPassword = await bcrypt.hash(password, 5)
        const q = process.env.INSERT_USER
        const values = [email, hashedPassword, role.toLowerCase()]
        connection.query(q, [values], (err, result ,fields) => {
        if (err) return next(err)
        const token = jwtSign(result.insertId, role.toLowerCase())
        res.status(200).json({
            status: "success",
            data: result,
            token
        })
    })
    } else {
        next(new CustomError("Invalid role input", 400))
    }
})

//route handler for signing in a user 
const signIn = asyncErrorHandler(async (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password) return next(new CustomError("Email and Password is required", 400))
    const q = process.env.QUERY_USER_WITH_EMAIL
    connection.query(q, [email], async (err, result, fields) => {
        if (err) return next(err)
        if (result[0] && await bcrypt.compare(password, result[0].password)) {
            const token = jwtSign(result[0].auth_id, result[0].role)
            res.status(200).json({
                status: "success",
                token
            })
        } else if (!result[0]) {
            return next(new CustomError("Email does not exist", 400))
        } else {
            return next(new CustomError("Password incorrect", 400))
        }
    })
})

//route handler for forgot password
const forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const {email} = req.body
    if (!email) return next(new CustomError("Email is required", 400))
    const q = process.env.UPDATE_TOKEN
    const resetToken = crypto.randomBytes(32).toString("hex")
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const resetTokenExpired = Date.now() + 10 * 60 * 1000;
    connection.query(q, [passwordResetToken, resetTokenExpired, email], async (err, result, fields) => {
        if (err) return next(err)
        if(result.affectedRows !== 1) return next (new CustomError("Email not found", 400))
        const resetUrl = `${process.env.FRONTEND_URL}/auth/resetpassword/${resetToken}`
        const message = `We have received a password reset request. Please use the link below to reset your password \n\n${resetUrl}\n\nThis link will only be available for 10 minutes`
            try {
                await sendEmail({
                    email: email,
                    subject: "Password reset link",
                    message
                })
                    res.status(200).json({
                    status: "success",
                    message: "password reset link sent to the user"
                })
            } catch (error) {
                connection.query(q, [null, null, email], (err, result, fields) => {
                    if (err) return next(err)
                })
                console.log(error)
                return next(new CustomError("There was an error sending password reset email, Please try again later", 500))
            }
    })
})

//router handler for resetting the password
const resetPassword = asyncErrorHandler(async (req, res, next) => {
    const {password, confirmPassword} = req.body
    const {token} = req.params
    if(!password || !confirmPassword) return next(new CustomError("Password and Confirm password field is required", 400))
    if(password !== confirmPassword) return next(new CustomError("Password and Confirm password does not match", 400))
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const hashedPassword = await bcrypt.hash(password, 5)
    const q = process.env.UPDATE_USER_PASSWORD
    const values = [hashedPassword, null, null, Date.now(), hashedToken, Date.now()]
    connection.query(q, values, (err, result, fields) => {
        if (err) return next (err)
        if (result.affectedRows !== 1) return next (new CustomError("Invalid is invalid or has expired!", 400))
        res.status(200).json({
            status: "success",
            message: "Password successfully changed"
        })
    })
}
)

module.exports = {signUp, signIn, forgotPassword, resetPassword}
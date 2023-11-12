const pool = require("../index");
const promisePool = pool.promise();
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
        const q = process.env.INSERT_USER//
        const values = [email, hashedPassword, role.toLowerCase()]
        const [query_result, fields, err] = await promisePool.query(q, [values])
        if (err) return next(err)
        const token = jwtSign(query_result.insertId, role.toLowerCase())
        res.status(200).json({
            status: "success",
            data: query_result,
            token
        })
    } else {
        next(new CustomError("Invalid role input", 400))
    }
})

//route handler for signing in a user //refactored to using promised pool
const signIn = asyncErrorHandler(async (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password) return next(new CustomError("Email and Password is required", 400))
    const q = process.env.QUERY_USER_WITH_EMAIL//

    const [query_result, fields, err] = await promisePool.query(q, [email])
    if (err) return next(err)
    if (query_result.length > 0 && await bcrypt.compare(password, query_result[0].password)) {
        const token = jwtSign(query_result[0].auth_id, query_result[0].role)
        res.status(200).json({
            status: "success",
            token
        })
    } else if (query_result.length === 0) {
        return next (new CustomError("Email does not exist", 400))
    } else {
        return next (new CustomError("Password incorrect", 400))
    }
})

//route handler for forgot password //refactored to using promised pool
const forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const {email} = req.body
    if (!email) return next(new CustomError("Email is required", 400))
    const q = process.env.UPDATE_TOKEN//
    const resetToken = crypto.randomBytes(32).toString("hex")
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const resetTokenExpired = Date.now() + 10 * 60 * 1000;
    const [query_result, fields, err] = await promisePool.query(q, [passwordResetToken, resetTokenExpired, email])
        if (err) return next(err)
        if(query_result.affectedRows !== 1) return next (new CustomError("Email not found", 400))
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
                const [query_result, fields, err] = await promisePool.query(q, [null, null, email])
                if (err) return next(err)
                return next(new CustomError("There was an error sending password reset email, Please try again later", 500))
            }
})

//router handler for resetting the password //refactored to using promised pool
const resetPassword = asyncErrorHandler(async (req, res, next) => {
    const {password, confirmPassword} = req.body
    const {token} = req.params
    if(!password || !confirmPassword) return next(new CustomError("Password and Confirm password field is required", 400))
    if(password !== confirmPassword) return next(new CustomError("Password and Confirm password does not match", 400))
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const hashedPassword = await bcrypt.hash(password, 5)
    const q = process.env.UPDATE_USER_PASSWORD//
    const values = [hashedPassword, null, null, Date.now(), hashedToken, Date.now()]
    const [query_result, fields, err] = await promisePool.query(q, values)
        if (err) return next (err)
        if (query_result.affectedRows !== 1) return next (new CustomError("Invalid is invalid or has expired!", 400))
        res.status(200).json({
            status: "success",
            message: "Password successfully changed"
        })
}
)

module.exports = {signUp, signIn, forgotPassword, resetPassword}
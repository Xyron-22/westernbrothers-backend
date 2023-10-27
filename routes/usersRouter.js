const express = require("express");
const {signUp, signIn, forgotPassword, resetPassword} = require("../controllers/authController");

const router = express.Router()

//route for signing up a user o an admin
router.route("/signup")
    .post(signUp)

//route for signing in a user or admin account
router.route("/signin")
    .post(signIn)

//route for forgot password
router.route("/forgotpassword")
    .post(forgotPassword)

router.route("/resetpassword/:token")
    .patch(resetPassword)

module.exports = router

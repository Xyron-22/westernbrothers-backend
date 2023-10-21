const express = require("express");
const {insertRecord} = require("../controllers/formControllers")

const router = express.Router()

router.route("/form")
    .post(insertRecord)

module.exports = router
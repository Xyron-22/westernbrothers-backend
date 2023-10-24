const express = require("express");
const {insertRecord, getRecord} = require("../controllers/formControllers")

const router = express.Router()

router.route("/form")
    .get(getRecord)
    .post(insertRecord)

module.exports = router
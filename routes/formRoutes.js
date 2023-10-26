const express = require("express");
const {insertRecordInOrderTable, getAllOrderRecords} = require("../controllers/orderTableController")
const {getAllAccountRecords, getAccountBasedOnDsp} = require("../controllers/accountTableController");
const {getAllProductRecords} = require("../controllers/productTableController");
const {signUp, signIn} = require("../controllers/authController");

const router = express.Router()

router.route("/signup")
    .post(signUp)

router.route("/signin")
    .post(signIn)

router.route("/order")
    .get(getAllOrderRecords)
    .post(insertRecordInOrderTable)

router.route("/account")
    .get(getAllAccountRecords)

router.route("/account/:dsp")
    .get(getAccountBasedOnDsp)

router.route("/product")
    .get(getAllProductRecords)


module.exports = router
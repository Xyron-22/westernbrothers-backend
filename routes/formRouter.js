const express = require("express");
const {insertRecordInOrderTable, getAllOrderRecords} = require("../controllers/orderTableController")
const {getAllAccountRecords, getAccountBasedOnDsp} = require("../controllers/accountTableController");
const {getAllProductRecords} = require("../controllers/productTableController");

const router = express.Router()

//route for order table
router.route("/order")
    .get(getAllOrderRecords)
    .post(insertRecordInOrderTable)

//route for account table
router.route("/account")
    .get(getAllAccountRecords)

router.route("/account/:dsp")
    .get(getAccountBasedOnDsp)

//route for product table
router.route("/product")
    .get(getAllProductRecords)


module.exports = router
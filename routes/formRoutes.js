const express = require("express");
const {insertRecordInOrderTable, getAllOrderRecords} = require("../controllers/orderTableController")
const {getAllAccountRecords} = require("../controllers/accountTableController");

const router = express.Router()

router.route("/order")
    .get(getAllOrderRecords)
    .post(insertRecordInOrderTable)

router.route("/account")
    .get(getAllAccountRecords)

module.exports = router
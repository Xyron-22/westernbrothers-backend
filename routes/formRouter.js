const express = require("express");
const {insertRecordInOrderTable, getAllOrderRecords, deleteRecordInOrderTable, getAllOrderData, deleteAllRecordsInOrderTable, getAllOrderRecordsBasedOnAuthId, updateStatusOfAnOrderRecord, getAllOrderRecordsBasedOnAccountId} = require("../controllers/orderTableController")
const {getAllAccountRecords, getAccountBasedOnDsp, insertRecordInAccountTable, deleteRecordInAccountTable} = require("../controllers/accountTableController");
const {getAllProductRecords, insertRecordInProductTable, deleteRecordInProductTable, updateStocksRecordInProductTable} = require("../controllers/productTableController");
const {checkIfLoggedIn, checkIfAuthorized, checkIfChangedPassRecently} = require("../controllers/middlewares");

const router = express.Router()

//route for order table
router.route("/order")
    .get(getAllOrderRecords)
    .post(checkIfLoggedIn, checkIfChangedPassRecently, insertRecordInOrderTable)
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, deleteAllRecordsInOrderTable)
    .patch(checkIfLoggedIn, checkIfChangedPassRecently, updateStatusOfAnOrderRecord)

router.route("/order/data")
    .get(getAllOrderData)

router.route("/order/:id")
    .get(getAllOrderRecordsBasedOnAuthId)
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, deleteRecordInOrderTable)

router.route("/order/account/:accountId")
    .get(getAllOrderRecordsBasedOnAccountId)

//route for account table
router.route("/account")
    .get(getAllAccountRecords)
    .post(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, insertRecordInAccountTable)

router.route("/account/:id")
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, deleteRecordInAccountTable)

router.route("/account/:dsp")
    .get(getAccountBasedOnDsp)

//route for product table
router.route("/product")
    .get(getAllProductRecords)
    .post(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, insertRecordInProductTable)
    .patch(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, updateStocksRecordInProductTable)

router.route("/product/:id")
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, deleteRecordInProductTable)

module.exports = router
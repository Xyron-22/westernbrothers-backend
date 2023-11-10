const express = require("express");
const {insertRecordInOrderTable, getAllOrderRecords, deleteRecordInOrderTable} = require("../controllers/orderTableController")
const {getAllAccountRecords, getAccountBasedOnDsp, insertRecordInAccountTable, deleteRecordInAccountTable} = require("../controllers/accountTableController");
const {getAllProductRecords, insertRecordInProductTable, deleteRecordInProductTable} = require("../controllers/productTableController");
const {checkIfLoggedIn, checkIfAuthorized, checkIfChangedPassRecently} = require("../controllers/middlewares");

const router = express.Router()

//route for order table
router.route("/order")
    .get(getAllOrderRecords)
    .post(checkIfLoggedIn, checkIfChangedPassRecently, insertRecordInOrderTable)

router.route("/order/:id")
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, deleteRecordInOrderTable)

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

router.route("/product/:id")
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, deleteRecordInProductTable)

module.exports = router
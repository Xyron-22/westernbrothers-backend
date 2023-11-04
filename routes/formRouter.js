const express = require("express");
const {insertRecordInOrderTable, getAllOrderRecords} = require("../controllers/orderTableController")
const {getAllAccountRecords, getAccountBasedOnDsp, insertRecordInAccountTable} = require("../controllers/accountTableController");
const {getAllProductRecords, insertRecordInProductTable} = require("../controllers/productTableController");
const {checkIfLoggedIn, checkIfAuthorized, checkIfChangedPassRecently} = require("../controllers/middlewares");

const router = express.Router()

//route for order table
router.route("/order")
    .get(getAllOrderRecords) //checkIfLoggedIn, checkIfChangedPassRecently, 
    .post(checkIfLoggedIn, checkIfChangedPassRecently, insertRecordInOrderTable) //checkIfLoggedIn, checkIfChangedPassRecently, 

//route for account table
router.route("/account")
    .get(getAllAccountRecords) //checkIfLoggedIn, checkIfChangedPassRecently, 
    .post(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, insertRecordInAccountTable)

router.route("/account/:dsp")
    .get(getAccountBasedOnDsp) //checkIfLoggedIn, checkIfChangedPassRecently, 

//route for product table
router.route("/product")
    .get(getAllProductRecords) //checkIfLoggedIn, checkIfChangedPassRecently,
    .post(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, insertRecordInProductTable) 


module.exports = router
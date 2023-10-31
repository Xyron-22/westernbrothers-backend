const express = require("express");
const {insertRecordInOrderTable, getAllOrderRecords} = require("../controllers/orderTableController")
const {getAllAccountRecords, getAccountBasedOnDsp} = require("../controllers/accountTableController");
const {getAllProductRecords} = require("../controllers/productTableController");
const {checkIfLoggedIn, checkIfAuthorized, checkIfChangedPassRecently} = require("../controllers/middlewares");

const router = express.Router()

//route for order table
router.route("/order")
    .get(getAllOrderRecords) //checkIfLoggedIn, checkIfChangedPassRecently, 
    .post(checkIfLoggedIn, checkIfChangedPassRecently, insertRecordInOrderTable)

//route for account table
router.route("/account")
    .get(getAllAccountRecords) //checkIfLoggedIn, checkIfChangedPassRecently, 

router.route("/account/:dsp")
    .get(getAccountBasedOnDsp) //checkIfLoggedIn, checkIfChangedPassRecently, 

//route for product table
router.route("/product")
    .get(getAllProductRecords) //checkIfLoggedIn, checkIfChangedPassRecently, 


module.exports = router
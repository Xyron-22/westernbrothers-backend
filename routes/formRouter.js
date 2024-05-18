const express = require("express");
//order table
const {
    insertRecordInOrderTable, 
    getAllOrderRecords, 
    deleteRecordInOrderTable, 
    getAllOrderData, 
    deleteAllRecordsInOrderTable, 
    getAllOrderRecordsBasedOnAuthId, 
    updateStatusOfAnOrderRecord, 
    getAllOrderRecordsBasedOnAccountId,
    getAllPendingOrders,
    getAllInvoicedOrders,
    getAllPaidOrders,
    deleteSelectedRecordsInOrderTable,
    updateAnOrderRecord,
} = require("../controllers/orderTableController")
//account table
const {
    getAllAccountRecords, 
    getAccountBasedOnDsp, 
    insertRecordInAccountTable, 
    deleteRecordInAccountTable,
    deleteSelectedRecordsInAccountTable
} = require("../controllers/accountTableController");
//product table
const {
    getAllProductRecords, 
    insertRecordInProductTable, 
    deleteRecordInProductTable, 
    updateStocksRecordInProductTable,
    deleteSelectedProductsInProductTable,
    updateAProductRecord
} = require("../controllers/productTableController");
//auth table
const {
    checkIfLoggedIn, 
    checkIfAuthorized, 
    checkIfChangedPassRecently
} = require("../controllers/middlewares");

const router = express.Router()

//route for order table
router.route("/order")
    .get(getAllOrderRecords)
    .post(checkIfLoggedIn, checkIfChangedPassRecently, insertRecordInOrderTable)
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, deleteAllRecordsInOrderTable)
    .patch(checkIfLoggedIn, checkIfChangedPassRecently, updateStatusOfAnOrderRecord)

    //for getting analytics
router.route("/order/data")
    .get(getAllOrderData)
    //for getting pending orders
router.route("/order/pending")
    .get(getAllPendingOrders)
    //for getting invoiced orders
router.route("/order/invoiced")
    .get(getAllInvoicedOrders)
    //for getting paid orders
router.route("/order/paid")
    .get(getAllPaidOrders)
    //for deleting selected order ids
router.route("/order/selected")
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, deleteSelectedRecordsInOrderTable)

router.route("/order/:id")
    .get(getAllOrderRecordsBasedOnAuthId)
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, deleteRecordInOrderTable)
    .patch(checkIfLoggedIn, checkIfChangedPassRecently, updateAnOrderRecord)

router.route("/order/account/:accountId")
    .get(getAllOrderRecordsBasedOnAccountId)

//route for account table
router.route("/account")
    .get(getAllAccountRecords)
    .post(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, insertRecordInAccountTable)

router.route("/account/selected")
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, deleteSelectedRecordsInAccountTable)

router.route("/account/:id")
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, deleteRecordInAccountTable)

router.route("/account/:dsp")
    .get(getAccountBasedOnDsp)

//route for product table
router.route("/product")
    .get(getAllProductRecords)
    .post(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, insertRecordInProductTable)
    .patch(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, updateStocksRecordInProductTable)

router.route("/product/selected")
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, deleteSelectedProductsInProductTable)

router.route("/product/:id")
    .delete(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, deleteRecordInProductTable)
    .patch(checkIfLoggedIn, checkIfChangedPassRecently, checkIfAuthorized, updateAProductRecord)


module.exports = router
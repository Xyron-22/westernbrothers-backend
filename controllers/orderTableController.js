const createConnection = require("../index");
const CustomError = require("../utils/customErrorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

//route handler for inserting new record/s for order table //refactored to using promised pool
const insertRecordInOrderTable = asyncErrorHandler(async (req, res, next) => {
    const {orderDate, accountId, customerName, tinNumber, contactNumber, term, products, remarksFreebiesConcern, deliveryDate} = req.body
    const q = process.env.INSERT_ORDER//
    const values = products.map(({productId, quantity, price}) => {
        return [orderDate, accountId, productId, customerName, tinNumber, contactNumber, term, remarksFreebiesConcern, deliveryDate, quantity, price]
    })

    const connection = createConnection()
    connection.query(q, [values], (err, query_result, fields) => { //changed to query
        if (err) {
            connection.end()
            return next(err)
        }
        connection.end()
        res.status(200).json({
            status: "success",
            data: query_result,
        })
    })
})

//route handler for getting all of the records in order table, join with the product and account table //refactored to using promised pool
const getAllOrderRecords = asyncErrorHandler(async (req, res, next) => {
    const q = process.env.QUERY_ORDER//
    const connection = createConnection()
    connection.execute(q, (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }
        connection.end()
        res.status(200).json({
            status: "success",
            data: query_result,
        })
    })       
})

//route handler for extracting necessary data for analytics
const getAllOrderData = asyncErrorHandler(async (req, res, next) => {
    const q = process.env.QUERY_ORDER_DATA
    const q2 = process.env.QUERY_ORDER_DSP_DATA
    const q3 = process.env.QUERY_ORDER_PRODUCT_DATA
    const q4 = process.env.QUERY_ORDER_ACCOUNT_DATA
    const connection = createConnection()
    let months = [];
    let year = {
      orders: 0,
      products: 0,
      sales: 0
    };
    let currentMonth;
    let previousMonth;
    let prevMonthIndex;
    let dspData;
    let productData;
    let accountData;
    connection.execute(q, (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }     
          for (let i = 0; i < 12; i++) {
            let month;
            let currentYear = new Date(Date.now()).getFullYear()
            i + 1 > 9 ? month = `${currentYear}-${i + 1}` : month = `${currentYear}-0${i + 1}`
            const result = query_result.filter((monthData) => monthData.year_date === month)
            if (month === (i + 1 > 9 ? `${currentYear}-${new Date(Date.now()).getMonth() + 1}` : `${currentYear}-0${new Date(Date.now()).getMonth() + 1}`)) {
                if (result[0]) {
                    currentMonth = {
                        year_date: result[0].year_date,
                        total_orders: result[0].total_orders,
                        total_products: Number(result[0].total_products),
                        total_sales: Number(result[0].total_sales),
                    }
                } else {
                    currentMonth = {
                        year_date: month,
                        total_orders: 0,
                        total_products: 0,
                        total_sales: 0
                    }
                }
                prevMonthIndex = i
            }
            if (result.length === 1) {
              months.push({
                date: month,
                orders: result[0].total_orders,
                products: Number(result[0].total_products),
                sales: Number(result[0].total_sales)
              })
              year.orders = result[0].total_orders + year.orders,
              year.products = Number(result[0].total_products) + year.products,
              year.sales = Number(result[0].total_sales) + year.sales
            } else {
              months.push({
                date: month,
                orders: 0,
                products: 0,
                sales: 0
              })
            }
          }
          previousMonth = months[prevMonthIndex - 1]
        connection.execute(q2, (err, query_result, fields) => {
            if (err) {
                connection.end()
                return next(err)
            }
            dspData = query_result
            connection.execute(q3, (err, query_result, fields) => {
                if (err) {
                    connection.end()
                    return next(err)
                }
                productData = query_result
               connection.execute(q4, (err, query_result, fields) => {
                if (err) {
                    connection.end()
                    return next(err)
                }
                connection.end()
                accountData = query_result
                res.status(200).json({
                    status: "success",
                    data: {
                        months,
                        year,
                        currentMonth,
                        previousMonth,
                        dspData,
                        productData,
                        accountData
                    }
                })
               })
            })            
        })
    })
})
//test
//route handler for deleting a record in order table //refactored to using promised pool
const deleteRecordInOrderTable = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!id) return next(new CustomError("No ID attached", 400))
    const q = process.env.DELETE_ORDER//
    const connection = createConnection()
    connection.execute(q, [id], (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        }
        connection.end()
        res.status(200).json({
            status: "success",
            data: query_result
        })
    }) 
})

//route handler for deleting all of order records in the records table
const deleteAllRecordsInOrderTable = asyncErrorHandler(async (req, res, next) => {
    const q = process.env.RESET_ORDER_ID_COUNT
    const q2 = process.env.TRUNCATE_ORDER_TABLE
    const connection = createConnection()
    connection.execute(q, (err, query_result, fields) => {
        if (err) {
            connection.end()
            return next(err)
        } connection.execute(q2, (err, query_result, fields) => {
            if (err) {
                connection.end()
                return next(err)
            }
            connection.end()
            res.status(200).json({
                status: "success",
                data: query_result
            })
        })
    })
})

module.exports = {insertRecordInOrderTable, getAllOrderRecords, deleteRecordInOrderTable, getAllOrderData, deleteAllRecordsInOrderTable}
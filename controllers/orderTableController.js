const createConnection = require("../index");
const CustomError = require("../utils/customErrorHandler");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

//route handler for inserting new record/s for order table //refactored to using promised pool
const insertRecordInOrderTable = asyncErrorHandler(async (req, res, next) => {
    const {orderDate, accountId, customerName, tinNumber, contactNumber, term, products, remarksFreebiesConcern, deliveryDate, auth_id} = req.body
    const q = "INSERT INTO `order` (order_date, account_id, product_id, customer_name, tin, contact, terms, remarks_freebies_concern, delivery_date, quantity, price, time_stamp, auth_id) VALUES ?"
    const values = products.map(({productId, quantity, price}) => {
        return [orderDate, accountId, productId, customerName, tinNumber || null, contactNumber || null, term, remarksFreebiesConcern, deliveryDate, quantity, price, Date.now(), auth_id]
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
    const q = "SELECT order_id, order_date, customer_number, account_name, order.account_id, location, dsp, mat_description, quantity, price, customer_name, tin, contact, terms, remarks_freebies_concern, delivery_date, quantity * price AS total_price, time_stamp, status FROM `order` INNER JOIN `account` ON order.account_id = account.account_id INNER JOIN `product` ON order.product_id = product.product_id ORDER BY order_id DESC"
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

//route handler for getting all of the records in order table filtered by the account_id
const getAllOrderRecordsBasedOnAccountId = asyncErrorHandler(async (req, res, next) => {
    const {accountId} = req.params
    const q = "SELECT * FROM `order` INNER JOIN `account` ON order.account_id = account.account_id INNER JOIN `product` ON order.product_id = product.product_id WHERE order.account_id = ?"
    const connection = createConnection()
    connection.execute(q, [accountId], (err, query_result, fields) => {
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

//route handler for getting all of the records in order table filtered by the auth_id account that inserted them
const getAllOrderRecordsBasedOnAuthId = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params
    const q = "SELECT order_id, order_date, customer_number, account_name, location, dsp, mat_description, quantity, price, customer_name, tin, contact, terms, remarks_freebies_concern, delivery_date, quantity * price AS total_price, time_stamp, status FROM `order` INNER JOIN `account` ON order.account_id = account.account_id INNER JOIN `product` ON order.product_id = product.product_id WHERE auth_id = ? ORDER BY order_id DESC"
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

//route handler for getting all the orders with pending status
const getAllPendingOrders = asyncErrorHandler(async (req, res, next) => {
    const q = "SELECT * FROM `order` INNER JOIN `account` ON order.account_id = account.account_id INNER JOIN `product` ON order.product_id = product.product_id WHERE order.status = 'Pending' ORDER BY order_id DESC"
    const connection = createConnection()
    connection.execute(q, (err, query_result, fields) => {
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

//route handler for getting all the orders with invoiced status
const getAllInvoicedOrders = asyncErrorHandler(async (req, res, next) => {
    const q = "SELECT * FROM `order` INNER JOIN `account` ON order.account_id = account.account_id INNER JOIN `product` ON order.product_id = product.product_id WHERE order.status = 'Invoiced' ORDER BY order_id DESC"
    const connection = createConnection()
    connection.execute(q, (err, query_result, fields) => {
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

//route handler for getting all the orders with paid status
const getAllPaidOrders = asyncErrorHandler(async (req, res, next) => {
    const q = "SELECT * FROM `order` INNER JOIN `account` ON order.account_id = account.account_id INNER JOIN `product` ON order.product_id = product.product_id WHERE order.status = 'Paid' ORDER BY order_id DESC"
    const connection = createConnection()
    connection.execute(q, (err, query_result, fields) => {
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

//route handler for extracting necessary data for analytics
const getAllOrderData = asyncErrorHandler(async (req, res, next) => {
    const q = "SELECT DATE_FORMAT(order_date, '%Y-%m') AS year_date, COUNT(CASE WHEN status = 'Paid' THEN 1 END) AS total_paid_orders, COUNT(order_id) AS total_orders, SUM(CASE WHEN status = 'Paid' THEN quantity END) AS total_paid_products, SUM(quantity) AS total_products, SUM(CASE WHEN status = 'Paid' THEN price * quantity END) AS total_paid_sales, SUM(price * quantity) AS total_sales, COUNT(DISTINCT account_id) as outlet_numbers, SUM(CASE WHEN status = 'Paid' THEN uom * quantity END) AS paid_order_volume, SUM(uom * quantity) AS volume FROM `order` INNER JOIN `product` ON order.product_id = product.product_id GROUP BY DATE_FORMAT(order_date, '%Y-%m') ORDER BY DATE_FORMAT(order_date, '%Y-%m') ASC"
    const q2 = "SELECT dsp AS name, COUNT(CASE WHEN status = 'Paid' THEN order_id END) AS total_orders, CAST(SUM(CASE WHEN status = 'Paid' THEN quantity * price END) AS UNSIGNED) AS total_sales FROM `account` INNER JOIN `order` ON `account`.account_id = `order`.account_id WHERE YEAR(order_date) = DATE_FORMAT(NOW(), '%Y') GROUP BY dsp"
    const q3 = "SELECT mat_description AS name, COUNT(order_id) AS total_orders, CAST(SUM(quantity* price)AS UNSIGNED) AS total_sales FROM `product` INNER JOIN `order` ON `product`.product_id = `order`.product_id WHERE YEAR(order_date) = DATE_FORMAT(NOW(), '%Y') AND status = 'Paid' GROUP BY mat_description ORDER BY total_sales DESC"
    const q4 = "SELECT account_name AS name, COUNT(order_id) AS total_orders, CAST(SUM(quantity* price)AS UNSIGNED) AS total_sales FROM `account` INNER JOIN `order` ON `account`.account_id = `order`.account_id WHERE YEAR(order_date) = DATE_FORMAT(NOW(), '%Y') AND status = 'Paid' GROUP BY account_name ORDER BY total_sales DESC"
    const connection = createConnection()
    let months = [];
    let year = {
      paid_orders: 0,
      orders: 0,
      paid_products: 0,  
      products: 0,
      paid_sales: 0,
      sales: 0,
      outlets: 0,
      paid_volume: 0,
      volume: 0
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
                        total_paid_orders: result[0].total_paid_orders,
                        total_orders: result[0].total_orders,
                        total_paid_products: Number(result[0].total_paid_products),
                        total_products: Number(result[0].total_products),
                        total_paid_sales: Number(result[0].total_paid_sales),
                        total_sales: Number(result[0].total_sales),
                        outlet_numbers: result[0].outlet_numbers,
                        paid_order_volume: Number(result[0].paid_order_volume),
                        volume: Number(result[0].volume)
                    }
                } else {
                    currentMonth = {
                        year_date: month,
                        total_paid_orders: 0,
                        total_orders: 0,
                        total_paid_products: 0,
                        total_products: 0,
                        total_paid_sales: 0,
                        total_sales: 0,
                        outlet_numbers: 0,
                        paid_order_volume: 0,
                        volume: 0
                    }
                }
                prevMonthIndex = i
            }
            if (result.length === 1) {
              months.push({
                date: month,
                paid_orders: result[0].total_paid_orders,
                orders: result[0].total_orders,
                paid_products: Number(result[0].total_paid_products),
                products: Number(result[0].total_products),
                paid_sales: Number(result[0].total_paid_sales),
                sales: Number(result[0].total_sales),
                outlets: result[0].outlet_numbers,
                paid_volume: Number(result[0].paid_order_volume),
                volume: Number(result[0].volume)
              })
              year.paid_orders = result[0].total_paid_orders + year.paid_orders,
              year.orders = result[0].total_orders + year.orders,
              year.paid_products = Number(result[0].total_paid_products) + year.paid_products,
              year.products = Number(result[0].total_products) + year.products,
              year.paid_sales = Number(result[0].total_paid_sales) + year.paid_sales,
              year.sales = Number(result[0].total_sales) + year.sales,
              year.outlets = result[0].outlet_numbers + year.outlets,
              year.paid_volume = Number(result[0].paid_order_volume) + year.paid_volume,
              year.volume = Number(result[0].volume) + year.volume
            } else {
              months.push({
                date: month,
                paid_orders: 0,
                orders: 0,
                paid_products: 0,
                products: 0,
                paid_sales: 0,
                sales: 0,
                outlets: 0,
                paid_volume: 0,
                volume: 0
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
//route handler for deleting a record in order table //refactored to using promised pool
const deleteRecordInOrderTable = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!id) return next(new CustomError("No ID attached", 400))
    const q = "DELETE FROM `order` WHERE order_id = ?"
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

//route handler for deleting selected orders
const deleteSelectedRecordsInOrderTable = asyncErrorHandler(async (req, res, next) => {
    const {data} = req.body
    const q = "DELETE FROM `order` WHERE order_id IN (?)"
    const connection = createConnection()
    connection.query(q, [data], (err, query_result, fields) => {
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
    const q = "ALTER TABLE `order` AUTO_INCREMENT = 1"
    const q2 = "TRUNCATE TABLE `order`"
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

//route handler for updating an order's status, either paid or pending
const updateStatusOfAnOrderRecord = asyncErrorHandler(async (req, res, next) => {
    const {order_id, status} = req.body;
    if (order_id.length < 1 || !status) return next(new CustomError("All fields are required", 400))
    const q = "UPDATE `order` SET status = ? WHERE order_id IN (?)"
    const connection = createConnection()
    connection.query(q, [status, order_id], (err, query_result, fields) => {
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

//router handler for updating an order record
const updateAnOrderRecord = asyncErrorHandler(async (req, res, next) => {
    const {id} = req.params
    const {order_date, delivery_date, customer_name, quantity, price, terms, remarks_freebies_concern} = req.body
    if (!id || !order_date || !delivery_date || !customer_name || !quantity || !price || !terms || !remarks_freebies_concern) return next(new CustomError("Some fields are missing", 400))
    const q = "UPDATE `order` SET order_date = ?, delivery_date = ?, customer_name = ?, quantity = ?, price = ?, terms = ?, remarks_freebies_concern = ? WHERE order_id = ?"
    const connection = createConnection()
    connection.execute(q, [order_date, delivery_date, customer_name, quantity, price, terms, remarks_freebies_concern, id], (err, query_result, fields) => {
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

module.exports = {insertRecordInOrderTable, 
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
    updateAnOrderRecord
}
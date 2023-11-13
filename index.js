require("dotenv").config();
const mysql = require("mysql2");

process.on("uncaughtException", (error) => {
    console.log("program error occurred " + error)
})


module.exports = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_USER_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        // maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        // idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        // enableKeepAlive: true,
        // keepAliveInitialDelay: 0,
    }
) 

const keepAlive = require("./utils/keepAlive");
    
// setInterval(keepAlive, 150000); // ping to DB every 2 minutes
    
const app = require("./app")

app.listen(process.env.PORT, () => {
    console.log("app listening to port:" + process.env.PORT)
})

process.on("unhandledRejection", (error) => {
    console.log("unhandled rejection occurred " + error)
})
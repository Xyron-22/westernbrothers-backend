require("dotenv").config();
const mysql = require("mysql2");

process.on("uncaughtException", (error) => {
    console.log("program error occurred " + error)
})

module.exports = mysql.createConnection(
    {
        host: process.env.NODE_ENV === "Development" ? "localhost" : process.env.DB_HOST,
        user: process.env.NODE_ENV === "Development" ? "root" : process.env.DB_USER,
        password: process.env.DB_USER_PASS,
        database: process.env.NODE_ENV === "Development" ? "webform" : process.env.DB_NAME,
    }
)

const app = require("./app")

app.listen(process.env.PORT, "127.0.0.1", () => {
    console.log("app listening to port:" + process.env.PORT)
})

process.on("unhandledRejection", (error) => {
    console.log("unhandled rejection occurred " + error)
})

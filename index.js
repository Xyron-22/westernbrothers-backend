require("dotenv").config();
const mysql = require("mysql2");

process.on("uncaughtException", (error) => {
    console.log("program error occurred " + error)
})

module.exports = () => {
    const connection = mysql.createConnection(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_USER_PASS,
            database: process.env.DB_NAME,
        }
    )
    console.log("created new connection")
    return connection 
}
    
const app = require("./app")

app.listen(process.env.PORT, () => {
    console.log("app listening to port:" + process.env.PORT)
})

process.on("unhandledRejection", (error) => {
    console.log("unhandled rejection occurred " + error)
})


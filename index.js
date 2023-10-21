require("dotenv").config();

process.on("uncaughtException", (error) => {
    console.log("program error occurred " + error.message)
})

const app = require("./app")


app.listen(process.env.PORT, "127.0.0.1", () => {
    console.log("app listening to port:" + process.env.PORT)
})

process.on("unhandledRejection", (error) => {
    console.log("unhandled rejection occurred " + error.message)
})
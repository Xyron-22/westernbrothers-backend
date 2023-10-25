const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const formRoutes = require("./routes/formRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

if(process.env.NODE_ENV === "Development") {
    app.use(morgan("dev"))
}

app.use("/api/v1", formRoutes)

app.use(globalErrorHandler)

module.exports = app
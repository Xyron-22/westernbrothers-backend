const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// const cookieParser = require("cookie-parser");
const formRouter = require("./routes/formRouter");
const usersRouter = require("./routes/usersRouter");
const globalErrorHandler = require("./controllers/errorController");
const CustomError = require("./utils/customErrorHandler");

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_STRING))

if(process.env.NODE_ENV === "Development") {
    app.use(morgan("dev"))
}

app.use("/api/v1/form", formRouter)
app.use("/api/v1/users", usersRouter)

app.use("*", (req, res, next) => {
    next(new CustomError("Not Found", 404))
})

app.use(globalErrorHandler)

module.exports = app
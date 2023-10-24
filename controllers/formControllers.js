const mockData = require("../mockData");


const insertRecord = (req, res, next) => {
    console.log(req.body)
    res.status(200).json({
        status: "success",
        data: req.body
    })
}

const getRecord = (req, res, next) => {
    res.status(200).json(mockData)
}

module.exports = {insertRecord, getRecord}
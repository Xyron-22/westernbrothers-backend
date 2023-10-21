
const insertRecord = (req, res, next) => {
    console.log(req.body)
    res.status(200).json({
        status: "success",
        data: req.body
    })
}

module.exports = {insertRecord}
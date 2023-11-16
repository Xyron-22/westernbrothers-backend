const express = require("express")
const awakeServer = require("../controllers/awakeServerController");

const router = express.Router()

router.route("/restart")
    .get(awakeServer)

module.exports = router
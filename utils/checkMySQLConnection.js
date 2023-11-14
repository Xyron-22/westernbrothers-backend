const pool = require("../index");
const promisePool = pool.promise();

module.exports = async (next) => {
    try {
        const [result, fields, err] = await promisePool.query("SELECT 1 + 1 AS solution")
        if(err) return next(err)
    } catch (error) {
        console.log("MySQL connection timeout" + error)
    } 
}
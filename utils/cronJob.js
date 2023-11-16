const {CronJob} = require("cron");
const https = require("https");

const backendUrl = `${process.env.BACKEND_URL}/server/restart`;
const job = new CronJob(
    '0 */14 * * * *',
    function () {
        console.log("Restarting server...")

        https.get(backendUrl, (res) => {
            if(res.statusCode === 200) {
                console.log("server restarted");
            } else {
                console.error(`failed to restart server with status code: ${res.statusCode}`)
            }
        }).on('error', (err) => {
            console.error(`error during restart: ${err.message}`)
        })
    },
    null,
    false,
)

module.exports = job

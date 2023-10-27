const nodemailer = require("nodemailer");


const sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    })

    const emailOptions = {
        from: "WESTERN BROTHERS OIL AND LUBRICANTS INC.<support@WBOL.com>",
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(emailOptions)
}
   
module.exports = sendEmail;
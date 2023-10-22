const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth : {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    })
console.log("options.email: ", options)
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.to,
        subject: options.subject,
        text: options.message
    }
    await transporter.sendMail(mailOptions)
}

module.exports = sendMail;
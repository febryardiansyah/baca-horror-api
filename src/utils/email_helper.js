const nodemailer = require('nodemailer')
const config = require('../config/config')
const emailVerificationTemplate = require('../template/emailVerificationTemplate')

const sendEmail = async (data) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.googlemail.com',
            port: 465,
            secure: true,
            auth: {
                user: config.EMAIL.username,
                pass: config.EMAIL.password,
            }
        })
        const info = await transporter.sendMail({
            from: `"Febry Ardiansyah" <${config.EMAIL.username}>`, // sender address
            to: `febrymuhammad80@gmail.com`,
            subject: "Verifikasi email",
            html: emailVerificationTemplate(data),
        })
        console.log(info.messageId);
        return Promise.resolve(info);
    } catch (error) {
        return Promise.reject(error)
    }
}

module.exports = sendEmail
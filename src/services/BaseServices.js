const sendEmail = require("../utils/email_helper")
const { getRandomNumber } = require("../utils/utils")

module.exports = {
    emailVerification: (name, email,) => {
        try {
            const data = {}
            const randomNumber = getRandomNumber()
            data.name = name
            data.email = email
            data.code = randomNumber

            sendEmail(data)
        } catch (error) {
            throw error
        }
    }
}
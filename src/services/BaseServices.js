const { UserModel } = require("../database/model/model")
const sendEmail = require("../utils/email_helper")
const { getRandomNumber } = require("../utils/utils")

module.exports = {
    /// email verification, include send email
    emailVerification: (name, email, subject) => {
        try {
            const data = {}
            const randomNumber = getRandomNumber()
            data.name = name
            data.email = email
            data.code = randomNumber
            data.subject = subject

            sendEmail(data)

            return data
        } catch (error) {
            throw error
        }
    },
    /// validate if code exist in user
    validateEmailVerificationCode: async (email, code) => {
        try {
            const user = await UserModel.findOne({
                where: {
                    email: email
                },
                raw: true
            })
            if (user.email_verification_code !== code) {
                return false
            }

            return true
        } catch (error) {
            throw error
        }
    },
    /// check if email already verified or not yet
    checkEmailVerified: async(email) => {
        try {
            const user = await UserModel.findOne({
                where: {
                    email
                },
                raw: true
            })

            if (user.email_verified === 0) {
                return false
            }
            
            return true
        } catch (error) {
            throw error
        }
    }
}
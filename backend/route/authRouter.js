const express = require('express')
const Router = express.Router()
const Contr = require('./../controller/authController')

Router.post('/register', Contr.register)
Router.get('/login', Contr.login)
Router.patch('/user-email-verification', Contr.verification)
Router.patch('/user-confirm', Contr.Otp)
Router.patch('/user-confirm/otp-reset', Contr.OtpReset)
Router.get('/user-confirm/resend-email/:id', Contr.ResendEmailOTP)

module.exports = Router
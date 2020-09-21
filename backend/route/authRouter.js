const express = require('express')
const Router = express.Router()
const Contr = require('./../controller/authController')

Router.post('/register', Contr.register)
Router.get('/login', Contr.login)
Router.patch('/user-email-verification', Contr.verification)

module.exports = Router
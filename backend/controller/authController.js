const hashPassword = require('./../helpers/hash')
const db = require('./../database/mysql')
const validator = require("validator")
const transporter = require('./../helpers/transporter')
const fs = require('fs')
const handlebars = require('handlebars')
const random = require('./../helpers/randomNumber')

// control register
const RegisterController = (req, res) => {
    // get all data value
    const data = req.body // {email, password}
    data.code_otp = random()

    // validasi data email dan password

    // if(data.email && data.password){
    //     if(!(validator.isEmail(data.email))){
    //         res.status(406).send({
    //             error : true,
    //             message : 'Email Format Wrong'
    //         })
    //     }
    //     if(data.password.length < 8){
    //         res.status(406).send({
    //             error : true,
    //             message : 'Password to short'
    //         })
    //     }
    //     res.send('succes')
    // }else{
    //     res.status(406).send({
    //         error : true,
    //         message : 'data not complete (email or password)'
    //     })
    // }

    // REFACTORED VALIDATE EMAIL AND PASS
    try {
        // Validate Email and Password
        if(!data.email || !data.password) throw 'Data not complete'
        if(!(validator.isEmail(data.email))) throw 'Email format wrong'
        if(data.password.length < 8) throw 'passord too short (min 8 Char'
        // res.send('succes')

        // Hash Password
        try {
            const passwordHashed = hashPassword(data.password)
            data.password = passwordHashed
            
        } catch (error) {
            res.status(406).send({
                error : true,
                message : 'failed to hash password'
            })
        }

        // check email already exist or not
        db.query('select * from users where email = ?', data.email, (err, result) => {
            try {
                if(err) throw err
                if(result.length > 0){
                    res.status(406).send({
                        error : true,
                        message : 'Email already exist'
                    })
                }else{
                    // Store data ke db
                    db.query('insert into users set ?', data, (err, result) => {
                        
                        try {
                            if(err) throw err
                            console.log(result)

                            fs.readFile('/Users/macbookpro/Documents/Purwadhika/BackEnd/authentication-systm/backend/template/emailConfirmation.html',{encoding :'utf-8'}, (err, file)=> {
                                if(err) throw err
                                const template = handlebars.compile(file)
                                const hasilTemplating = template({
                                    email : data.email, 
                                    random : data.code_otp
                                })
                                // send email confirm jika berhasil store ke database
                                transporter.sendMail({
                                    from : "admin",
                                    subject : "email verification",
                                    to : data.email,
                                    html : hasilTemplating
                                })
                                .then((respon) => {
                                    res.status(200).send({
                                        error : false,
                                        message : "register Succes, email alerady sent !",
                                        id : result.insertId
                                    })
                                })
                                .catch((err) => {
                                    res.status(500).send({
                                        error: true,
                                        message : err.message
                                    })
                                })
                                
                            } )

                        } catch (error) {
                            res.status(500).send({
                                error : true,
                                message : error.message
                            })
                        }
                    })
                }
            } catch (error) {
                res.status(500).send({
                    error : true,
                    message : error.message
                })
            }
        })
        
    } catch (error) {
        res.status(406).send({
            error : true,
            message : error
        })
    }
}

// control login
const LoginController = (req, res) => {
    const data = req.body
    
    try {
    if(!data.email || !data.password) throw 'Email and Password cant Empty'
    try {
        const passwordHashed = hashPassword(data.password)
        data.password = passwordHashed
    } catch (error) {
        res.status(406).send({
            error : true,
            message : 'failed to hash password'
        })
    }
    db.query(`select * from users where email = "${data.email}" and password = "${data.password}"`, (err, result) => {
        try {
            if(err) throw err
            if(result.length > 0){
                res.status(202).send({
                    error : false,
                    message : 'Login Succes',
                    data : {
                        id : result[0].id,
                        email : result[0].email,
                        created_at : result[0].created_at,
                        is_email_confirmation : result[0].is_email_confirmation
                    }
                })
            }else{
                res.status(406).send({
                    error : true,
                    message : 'Account not already yet or password wrong'
                })
            }
        } catch (error) {
            res.status(406).send({
                error : true,
                message : error
            })
        }
    })
    } catch (error) {
        res.status(406).send({
                error : true,
                message : error
            })
    }
}

const UserEmailVerificationController = (req, res) => {
    const data = req.body
    db.query('update users set is_email_confirmation = 1 where id = ? and password = ?;', [data.id, data.password], (err,result) => {
        try {
            if(err) throw err
            res.status(201).send({
                error : false,
                message : 'user email verified'
            })
        } catch (error) {
            res.status(500).send({
                error : true,
                message : error
            })
        }
    })
}

const UserEmailConfirmOTP = (req, res) => {
    const data = req.body
    db.query('select * from users where id = ?', data.id, (err, result) => {
        try {
            if(err) throw err
            if(data.code_otp === result[0].code_otp){
                db.query('update users set is_email_confirmation = 1 where id = ? and code_otp = ?', [data.id, data.code_otp], (err, result) => {
                    try {
                        if(err) throw err
                        res.send('sukses')
                    } catch (error) {
                        res.status(500).send({
                            error : true,
                            message : error
                        })
                    }
                })
            }else{
                res.send('gagal kode otp salah')
            }
        } catch (error) {
            res.send({
                error : true,
                message : error
            })
        }
    })
}

const OtpReset = (req, res) => {
    const data = req.body
    let code_otp = random()
    // console.log(code_otp)
    db.query('update users set code_otp = ? where id = ?', [code_otp, data.id], (err,result) => {
        try {
            if(err) throw err
            res.send('okey berhasil')
        } catch (error) {
            res.send({
                error : true,
                message : error
            })
        }
    })
}

const ResendEmailOTP = (req, res) => {
    let id = req.params.id
    db.query('select * from users where id = ?', id, (err, result) => {
        try {
            if(err) throw err
            fs.readFile('/Users/macbookpro/Documents/Purwadhika/BackEnd/authentication-systm/backend/template/emailConfirmation.html',{encoding :'utf-8'}, (err, file)=>{
                try {
                if(err) throw err
                const template = handlebars.compile(file)
                const hasilTemplating = template({
                    email : result[0].email, 
                    random : result[0].code_otp
                })
                // send email confirm jika berhasil store ke database
                transporter.sendMail({
                    from : "admin",
                    subject : "email verification",
                    to : result[0].email,
                    html : hasilTemplating
                })
                .then((respon) => {
                    res.status(200).send({
                        error : false,
                        message : "email alerady sent !"
                    })
                })
                .catch((err) => {
                    res.status(500).send({
                        error: true,
                        message : err.message
                    })
                })

                } catch (error) {
                    res.send({
                        error: true,
                        message : err.message
                    })
                }
            })

            // res.send(result)
        } catch (error) {
            res.send({
                error : true,
                message : error
            })
        }
    })
}
module.exports = {
    register : RegisterController,
    login : LoginController,
    verification : UserEmailVerificationController,
    Otp : UserEmailConfirmOTP,
    OtpReset : OtpReset,
    ResendEmailOTP : ResendEmailOTP
}
const express = require('express')
const cors = require('cors')
const AuthRouter = require('./route/authRouter')


const app = express()
const PORT = 5000
app.use(express.json())
app.use(cors())

// Create root ROUTE
app.get('/', (req,res) => {
    res.send('Hello Auth')
})
app.use('/auth', AuthRouter)

// app.get('/testmail', (req, res) => {

//     // create transporter
//     const transporter = nodemailer.createTransport(
//         {
//             service : "gmail",
//             auth : {
//                 user : "ahmadansorudin@gmail.com",
//                 pass : "qbrnvgiowvzuzueh"
//             },
//             tls : {
//                 rejectUnauthorized : false
//             }
//         }
//     )

//     // send mail
//     transporter.sendMail({
//         from : "ansorudin", // sender adress
//         to : "ahmad.zombies@gmail.com", // list of receivers
//         subject : "email confirmation", // subject line
//         html : "<b>Hello World</b>" // html body
//     })
//     // respon if succes
//     .then((res) => {
//         console.log(res)
//     })
//     .catch((err) => {
//         console.log(err)
//     })


//     })






app.listen(PORT, ()=> console.log('API RUNNING ON PORT' + PORT))
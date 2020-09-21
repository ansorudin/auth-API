const mysql = require('mysql')

// create db connection
const db = mysql.createConnection({
    user : 'root',
    password : 'Ahmadansorudin77',
    database : 'auth',
    port : 3306
})

module.exports = db
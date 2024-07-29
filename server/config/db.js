var mysql = require('mysql')
var connection = mysql.createConnection({
    host:'localhost',
    database:'sms',
    user:'root',
    password:'password'
})
module.exports = connection;


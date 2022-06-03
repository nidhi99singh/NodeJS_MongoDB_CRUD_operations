const mongoose = require('mongoose')

//const url = 'mongodb+srv://kuldeep:sujangarh@chat-app.fhjoy.mongodb.net/test'

const url = 'mongodb://localhost/employee'
mongoose.connect(url)

const con = mongoose.connection

module.exports = con
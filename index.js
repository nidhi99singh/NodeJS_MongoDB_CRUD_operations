const express = require('express')
const con = require('./mongodb_connector')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const app = express()

app.use(express.json())

dotenv.config()

let PORT = process.env.PORT || 5000

app.listen(PORT, () => {

    console.log('server started on port: ' + PORT)
})

con.on('open', () => {
    console.log('mongodb connected..')
})
var employeeRoutes = require('./Routes/employee')
app.use('/', employeeRoutes)

var productRoutes = require('./Routes/product')
app.use('/product', productRoutes)
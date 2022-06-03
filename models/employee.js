const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String
    },
    department: {
        type: String
    },
    role: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('employee', employeeSchema)
const express = require('express')
const employee = require('../models/employee')
const router = express.Router()
const Employee = require('../models/employee')
const jwt = require('jsonwebtoken')
const verifyToken = require('../auth')
const { authPage } = require('../middlewares')
const { default: jwtDecode } = require('jwt-decode')

//check connection

router.get('/', verifyToken, authPage(['user']), async (req, res) => {

    jwt.verify(req.token, 'secretkey', (err, authData) => {

        if (err) {
            res.sendStatus(403)
        }
        else {

            res.json({ message: 'successful api' })
            authData
        }
    })

})

router.get('/authorization', authPage(["user"]), async (req, res) => {

    res.json({ message: 'successful api' })
})

//get employee data

router.get('/getallemployees', verifyToken, authPage(['admin']), async (req, res) => {
    try {

        jwt.verify(req.token, 'secretkey', async (err, authData) => {

            if (err) {
                res.sendStatus(403)
            }
            else {
                const employees = await employee.find()
                res.json(employees)
            }
        })
    } catch (err) { res.json(err) }
})

//save employee data

router.post('/addemployee', async (req, res) => {
    const body = req.body
    try {
        const employee = new Employee({
            employeeName: body.employeeName,
            email: body.email,
            age: body.age,
            city: body.city,
            department: body.department,
            role: body.role
        })
        const existingEmployee = await Employee.findOne({ email: body.email })

        if (existingEmployee) {
            res.json("employee with this email already exist.")
        } else {
            const saveEmployee = await employee.save()
            res.json(saveEmployee)
        }
    } catch (error) {
        res.send("error:" + error)
    }
})

//get employee by id

router.get('/getemployeebyid/:id', verifyToken, authPage(['user', 'admin']), async (req, res) => {

    const employeeId = req.params.id
    try {

        jwt.verify(req.token, 'secretkey', async (err, authData) => {

            if (err) {
                res.sendStatus(403)
            }
            else {
                const employeeResponse = await employee.findById(employeeId)

                if (employeeResponse == null) {
                    res.json("employee with this id does not exist")
                } else {
                    res.json(employeeResponse)
                }
            }
        })

    } catch (error) { res.json("Error:" + error) }
})

//delete employeebyid

router.delete('/deleteemployee/:id', verifyToken, authPage(['admin']), async (req, res) => {
    const employeeId = req.params.id
    try {

        jwt.verify(req.token, 'secretkey', async (err, authData) => {

            if (err) {
                res.sendStatus(403)
            }
            else {
                const existingEmployee = await employee.findById(employeeId)

                if (existingEmployee == null) {
                    res.json("employee with this id does not exist.")
                } else {
                    const employeeDeleted = await Employee.findByIdAndDelete(employeeId)
                    res.json("employee deleted")
                }
            }
        })
    } catch (error) { res.json(error) }
})

//update employee department

router.patch('/updatedepartment/:id', verifyToken, authPage(['admin', 'user']), async (req, res) => {
    const employeeId = req.params.id

    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.json(err)
            } else {
                const employeeResponse = await Employee.findById(employeeId)

                if (employeeResponse == null) {
                    res.json("employee with this id does not exist.")
                } else {
                    employeeResponse.department = req.body.department
                    const updayedEmployyee = await employeeResponse.save()
                    res.json(updayedEmployyee)
                }
            }

        })
    } catch (error) { res.json(error) }
})

//update department and city

router.put('/updatedepartmentandcity/:id', verifyToken, authPage(['admin', 'user']), async (req, res) => {

    const employeeId = req.params.id
    try {

        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.json(err)
            } else {
                const employeeResponse = await Employee.findById(employeeId)

                if (employeeResponse == null) {
                    res.json("employee with this id does not exist.")
                } else {
                    employeeResponse.department = req.body.department
                    employeeResponse.city = req.body.city
                    const updatedEmployee = await employeeResponse.save()
                    res.json(updatedEmployee)
                }
            }
        })

    } catch (error) {
        res.json("message:" + error)
    }

})
//get employee by city

router.get('/getallemployeebycity/:city', async (req, res) => {
    const City = req.params.city
    var query = { city: City }
    const employees = await employee.find(query)

    if (Object.keys(employees).length == 0) {
        res.json("no employee belongs to:" + City)
    } else {
        res.json(employees)
    }
})

//generate jwt token

router.post('/token/', async (req, res) => {

    const email = req.body.email
    var query = { email: email }
    const employeeResponse1 = await employee.findOne({ email: email })
    const employeeRole = employeeResponse1.role
    jwt.sign({ email, employeeRole }, "secretkey", (err, token) => {
        res.json("Token: " + token)
    });
})

module.exports = router
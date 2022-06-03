const jwt = require('jsonwebtoken')
const { default: jwtDecode } = require('jwt-decode')

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken

        var payload = req.token.split('.')[1]
        console.log(payload)

        var decoded = jwtDecode(req.token)
        var employeeRole = decoded.employeeRole
        console.log(employeeRole)
        req.employeeRole = employeeRole

        next()
    } else {
        res.sendStatus(403)
    }
}

module.exports = verifyToken

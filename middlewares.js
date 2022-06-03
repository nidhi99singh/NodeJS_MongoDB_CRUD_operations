const verifyToken = require("./auth")

const authPage = (permissions) => {
    return (req, res, next) => {

        const role = req.employeeRole

        console.log({
            role: req.employeeRole
        })

        if (permissions.includes(role)) {
            return next()
        } else {
            return res.sendStatus(401)
        }

    }
}

module.exports = { authPage }
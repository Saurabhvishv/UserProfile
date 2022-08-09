
const jwt = require("jsonwebtoken")

const Auth = async function (req, res, next) {
    try {
        const token = req.header('x-api-key')
        if (!token) {
            res.status(403).send({ status: false, message: "Missing Authentication Token in req" })
            return
        }

        const decodedtoken = await jwt.verify(token, 'Group9')
        if (decodedtoken) {
            req.user = decodedtoken.userId

            next()
        }
    }

    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.Auth = Auth
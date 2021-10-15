const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer "token"
        const decoded_token = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded_token;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).send({ "message": 'jwt expired' });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).send({ "message": 'jwt malformed' });
        }
        if (err.name === "NotBeforeError") {
            return res.status(401).send({ "message": 'jwt not active' });
        }
    }
}

module.exports = {
    checkAuth
}
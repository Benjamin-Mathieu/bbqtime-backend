const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer "token"
        const decoded_token = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded_token;
        next();
    } catch (err) {
        return res.status(401).send({ "message": "Invalid or token provided !" });
    }
}

module.exports = {
    checkAuth
}
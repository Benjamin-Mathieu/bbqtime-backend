const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {

    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer "token"
        const decoded_token = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded_token;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            res.status(401).send({ "message": "Erreur JWT", "type": "expired" });
        }
        if (err.name === "JsonWebTokenError") {
            res.status(401).send({ "message": "Erreur JWT", "type": "malformed" });
        }
        if (err.name === "NotBeforeError") {
            res.status(401).send({ "message": "Erreur JWT", "type": "not active" });
        }
    }

}

module.exports = {
    checkAuth
}
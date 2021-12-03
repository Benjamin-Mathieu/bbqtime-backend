const Event = require('../models/Event');

function checkCode(req, res, next) {
    const password = req.body.password;
    const eventId = req.body.id;
    Event.findAll({
        where: { password: password }
    })
        .then((events) => {

            if (events.length === 0) {
                next();
            } else {
                events.forEach(event => {
                    if (event.id == eventId) {
                        next()
                    }
                    else {
                        return res.status(401).send({ "message": "Le mot de passe que vous avez saisie est déjà utilisé !" });
                    }
                });
            }
        })
        .catch(err => { console.error(err) });
}

module.exports = {
    checkCode
}
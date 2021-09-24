const Event = require('../models/Event');

function checkCode(req, res, next) {
    const password = req.body.password;
    Event.findAll({ where: { password: password } })
        .then((resp) => {
            if (Object.keys(resp).length > 0) {
                return res.status(401).send({ "message": "Le mot de passe que vous avez saisie est déjà utilisé sur un autre évènement !" });
            } else {
                next();
            }
        })
        .catch(err => { console.log(err) });
}

module.exports = {
    checkCode
}
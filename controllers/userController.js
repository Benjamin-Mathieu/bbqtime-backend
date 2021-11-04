const User = require('../models/User');
const ResetPasswords = require('../models/ResetPasswords');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const email = require("../services/email");

// POST new user
const user_post = async (req, res) => {

    const saltRounds = 10;
    const hash = bcrypt.hashSync(req.body.password, saltRounds);

    const find = await User.findOne({ where: { email: req.body.email } });
    if (!find) {
        try {
            const new_user = await User.create({
                email: req.body.email,
                name: req.body.name,
                firstname: req.body.firstname,
                phone: req.body.phone,
                password: hash
            });
            res.status(201).send({ "message": "Compte crée avec succès", "user": new_user })
        } catch (error) {
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        }
    } else {
        res.status(400).send({ "message": "Un utilisateur existe déjà sur cette adresse mail" });
    }
}

const user_put = async (req, res) => {
    try {
        const user = await User.findByPk(req.userData.id);

        if (!bcrypt.compareSync(req.body.data.password, user.password)) {
            res.status(401).send({ "message": "Mauvais mot de passe !" });
        } else {
            await User.update({
                email: req.body.data.email,
                name: req.body.data.name,
                firstname: req.body.data.firstname,
                phone: req.body.data.phone
            }, { where: { id: req.userData.id } });
            const informations = await User.findByPk(req.userData.id, { attributes: ["id", "name", "firstname", "phone", "email"] });
            res.status(200).send({ "message": "Compte mis à jour", "informations": informations });
        }

    } catch (err) {
        res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
    }

}

// DELETE one user
const user_delete = (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(result => {
            res.status(200).send({ "message": "User deleted" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        });
}

//Authenticate user
const user_login = (req, res) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user === null) {
                res.status(400).send({ "message": "L'utilisateur n'existe pas !" });
            }
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.status(401).send({ "message": "Mauvais mot de passe !" });
            }
            else {
                jwt.sign({
                    id: user.id,
                }, process.env.JWT_KEY, { expiresIn: '2 days' },
                    function (err, token) {
                        res.status(200).send({
                            "message": "Connexion réussie",
                            "token": token,
                            "informations": {
                                "id": user.id,
                                "email": user.email,
                                "firstname": user.firstname,
                                "name": user.name,
                                "phone": user.phone
                            }
                        })
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        })
}

const user_send_code = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
        const resetPwdIsSend = await ResetPasswords.findOne({ where: { user_id: user.id } });

        if (!resetPwdIsSend) {
            try {
                const returnedCode = await email.sendEmailResetPassword(user.email);
                ResetPasswords.create({
                    user_id: user.id,
                    code: returnedCode
                });
                res.status(200).send({ "message": "Vérifiez votre boite maîl" });
            } catch (err) {
                res.status(400).send({ "message": `Erreur pendant l'envoi: ${err}` });
            }
        } else {
            try {
                await email.sendEmailResetPassword(user.email, resetPwdIsSend.code);
                res.status(200).send({ "message": "Vérifiez votre boite maîl" });
            } catch (err) {
                res.status(400).send({ "message": `Erreur pendant l'envoi: ${err}` });
            }
        }
    } else {
        res.status(400).send({ "message": `L'adresse mail ${req.body.email} n'est pas enregistrée` })
    }
}

const user_check_code = async (req, res) => {
    const code = req.body.code;
    const user = await User.findOne({ where: { email: req.body.email } });
    const reset_password = await ResetPasswords.findOne({ where: { user_id: user.id } });

    if (code === reset_password.code) {
        jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: { id: user.id }
        }, process.env.JWT_KEY, (err, token) => {
            res.status(200).send({ "message": "Code accepté", "token": token })
        });
    } else {
        res.status(400).send({ "message": "Le code saisi ne corresponds pas" });
    }
}

const user_reset_password = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = jwt.decode(token);
    const saltRounds = 10;
    const hash = bcrypt.hashSync(req.body.new_password, saltRounds);

    const user = await User.findOne({ where: { id: decoded_token.data.id } });
    if (user) {
        await user.update({ password: hash });
        await ResetPasswords.destroy({ where: { user_id: decoded_token.data.id } });
        res.status(200).send({ "message": "Mot de passe mis à jour" });

    } else {
        res.status(401).send({ "message": "Veuillez de nouveau réclamer un code pour changer votre mot de passe" });
    }

}

const user_is_logged = async (req, res) => {
    const user = await User.findOne({ where: { id: req.userData.id } });
    res.status(200).send(
        {
            "message": "Connexion réussie",
            "userIsLogged": true,
            "informations": {
                "id": user.id,
                "email": user.email,
                "firstname": user.firstname,
                "name": user.name,
                "phone": user.phone
            }
        });
}


module.exports = {
    user_post,
    user_put,
    user_delete,
    user_login,
    user_send_code,
    user_check_code,
    user_reset_password,
    user_is_logged
}
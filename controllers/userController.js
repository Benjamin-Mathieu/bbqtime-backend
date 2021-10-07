const User = require('../models/User');
const ResetPasswords = require('../models/ResetPasswords');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const email = require("../services/email");

// GET all users
const user_listing = (req, res) => {
    User.findAll()
        .then(users => {

            let users_array = [];
            users.forEach(user => {
                users_array.push(user);
            });
            res.status(200).send({ users: users_array });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "error": "Something went wrong" });
        });
}

// GET one user
const user_get = (req, res) => {
    const user_id = req.params.id;

    User.findByPk(user_id)
        .then(user => {
            res.status(200).send(
                {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    firstname: user.firstname,
                    phone: user.phone,
                    zipcode: user.zipcode
                }
            )
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "error": "Something went wrong" });
        });
}

// POST new user
const user_post = (req, res) => {

    const saltRounds = 10;
    const hash = bcrypt.hashSync(req.body.password, saltRounds);

    // Create new user if not find in db
    User.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            email: req.body.email,
            name: req.body.name,
            firstname: req.body.firstname,
            phone: req.body.phone,
            password: hash,
            zipcode: req.body.zipcode
        }
    })
        .then(result => {
            res.status(201).send({ "message": "Account has been created" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "error": "Something went wrong" });
        });
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
            res.status(500).send({ "error": "Something went wrong" });
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
                const token = jwt.sign({
                    id: user.id,
                    name: user.name,
                    firstname: user.firstname,
                    email: user.email,
                    password: req.body.password
                }, process.env.JWT_KEY, function (err, token) {
                    res.status(200).send({
                        "message": "Utilisateur connecté !",
                        "id": user.id,
                        "token": token,
                        "informations": {
                            "id": user.id,
                            "email": user.email,
                            "firstname": user.firstname,
                            "name": user.name,
                            "phone": user.phone,
                            "zipcode": user.zipcode,
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
        email.sendEmailResetPassword(user.email)
            .then(async (returnedCode) => {

                await ResetPasswords.create({
                    user_id: user.id,
                    code: returnedCode
                });
                res.status(200).send({ "message": "Vérifiez votre boîte mail pour récupérer le code pour réinitialiser votre mot de passe" });
            })
            .catch(err => res.status(400).send({ "message": `Erreur pendant l'envoi: ${err}` }))
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

    const user = await User.findOne({ where: { id: decoded_token.data.id } });
    if (user) {
        await user.update({ password: req.body.new_password });
        await ResetPasswords.destroy({ where: { user_id: decoded_token.data.id } });
        res.status(200).send({ "message": "Mot de passe mis à jour" });

    } else {
        res.status(401).send({ "message": "Veuillez de nouveau réclamer un code pour changer votre mot de passe" });
    }

}


module.exports = {
    user_listing,
    user_get,
    user_post,
    user_delete,
    user_login,
    user_send_code,
    user_check_code,
    user_reset_password
}
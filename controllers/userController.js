const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
                res.status(400).send({ "message": "User not found" });
            }
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.status(401).send({ "message": "Wrong password" });
            }
            else {
                const token = jwt.sign({
                    id: user.id,
                    name: user.name,
                    firstname: user.firstname,
                    email: user.email,
                }, process.env.JWT_KEY, function (err, token) {
                    res.status(200).send({
                        "message": "User connected",
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
            res.status(500).send({ "message": "Something went wrong" });
        })
}

module.exports = {
    user_listing,
    user_get,
    user_post,
    user_delete,
    user_login
}
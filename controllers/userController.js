const User = require('../models/User');

const user_listing = (req, res) => {
    User.findAll()
    .then(users => {

        users.forEach(user => {
            console.log(`${user.id} ${user.email} ${user.name} ${user.firstname} ${user.phone}`)
        });
        res.sendStatus(200);
    })
    .catch(err => console.log(err))
}

// Find a user
const user_get = (req, res) => {
    const user_id = req.params.id;

    User.findByPk(user_id)
        .then(user => {
            console.log(`${user.id} ${user.email} ${user.name} ${user.firstname} ${user.phone}`);
            res.status(200).send(
                {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    firstname: user.firstname,
                    phone: user.phone
                }
            )
            res.sendStatus(200);
        })
        .catch(err => console.log(err))
}

// Create user
const user_post = (req, res) => {
    // Create new user if not find
    User.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            email: req.body.email,
            name: req.body.name,
            firstname: req.body.firstname,
            phone: req.body.phone,
            password: req.body.password
        }
    })
        .then(new_user => {
            res.status(201).send({ "message": "Account has been created" });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
}


module.exports = {
    user_listing,
    user_get,
    user_post
}
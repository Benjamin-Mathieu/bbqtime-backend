const Plat = require('../models/Plat');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');
const Categorie = require('../models/Categorie');

const plat_listing = (req, res) => {
    Plat.findAll({ include: [Categorie] })
        .then(plats => {
            let plats_array = [];
            plats.forEach(plat => {
                plats_array.push(plat);
            });
            res.status(200).send({ "plats": plats_array });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": "Something went wrong" });
        });
};

// GET one plat
const plat_get = (req, res) => {
    const plat_id = req.params.id;

    Plat.findByPk(plat_id)
        .then(plat => {
            res.status(200).send(
                {
                    id: plat.id,
                    libelle: plat.libelle,
                    event_id: plat.event_id,
                    photo_url: plat.photo_url,
                    user_id: plat.user_id,
                    quantity: plat.quantity,
                    price: plat.price,
                    description: plat.description,
                    category_id: plat.category_id
                }
            )
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": "Something went wrong" });
        });
};

// POST new plat
const plat_post = (req, res) => {

    // Collect users information
    const token = req.headers.authorization.split(" ")[1];
    const decoded_token = jwt.decode(token);

    Event.findByPk(req.body.event_id)
        .then(result => {
            // Check if user is event creator
            if (result.user_id === decoded_token.id) {
                Plat.create({
                    libelle: req.body.libelle,
                    event_id: req.body.event_id,
                    photo_url: req.body.photo_url,
                    user_id: decoded_token.id,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    description: req.body.description,
                    category_id: req.body.category_id
                })
                    .then(result => {
                        res.status(201).send({
                            "message": "Plat added to event",
                            "menu": result
                        })
                    })
                    .catch(err => console.log(err));
            } else {
                res.status(401).send({ "message": "User isn't event creator" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": "Something went wrong" });
        });
};

// UPDATE one plat
const plat_put = (req, res) => {
    Plat.update({
        libelle: req.body.libelle,
        photo_url: req.body.photo_url,
        quantity: req.body.quantity,
        price: req.body.price,
        description: req.body.description
    }, { where: { id: req.params.id } })
        .then(result => {
            res.status(200).send({ "message": "Plat updated" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": "Something went wrong" });
        })
}

// DELETE one plat
const plat_delete = (req, res) => {
    Plat.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(deleted_plat => {
            res.status(200).send({ "message": "Plat deleted" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": "Something went wrong" });
        })
};

module.exports = {
    plat_listing,
    plat_get,
    plat_post,
    plat_put,
    plat_delete
}
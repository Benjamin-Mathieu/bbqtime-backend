const Plat = require('../models/Plat');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

const plat_listing = (req, res) => {
    Plat.findAll()
    .then(plats => {
        let plats_array = [];
        plats.forEach(plat => {
          plats_array.push(plat);
        });
        res.status(200).send({ "plats": plats_array });
    })
    .catch(err => console.log(err))
}

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
                    category_id: plat.category_id
                }
            )
        })
        .catch(err => console.log(err))
}

// POST new plat
const plat_post = (req, res) => {
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
                    category_id: req.body.category_id
                })
                .then(new_plat => {
                    res.status(201).send({"message" : "Plat added to event"})
                })
                .catch(err => console.log(err));   
            } else {
                res.status(401).send({ "message": "User isn't the creathor of the event" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": "Something went wrong" });
        });  
}

// DELETE one plat
const plat_delete = (req, res) => {
    Plat.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(deleted_plat => {
            res.status(200).send({"message": "Plat deleted"})
        })
        .catch(err => {
            console.log(err);
            res.status(401).send({ "message": "User isn't the creathor of the event" });
        })
}

module.exports = {
    plat_listing,
    plat_get,
    plat_post,
    plat_delete
}
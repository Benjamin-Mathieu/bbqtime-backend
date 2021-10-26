const Plat = require('../models/Plat');
const Categorie = require('../models/Categorie');
const fs = require('fs');

// GET plat with categorie
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
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        });
};

// GET plat of a category
const plat_get = (req, res) => {

    Plat.findAll({ where: { category_id: req.params.id } })
        .then(plats => {
            res.status(200).send({ plats })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        });
};

// POST plat
const plat_post = (req, res) => {
    Plat.create({
        libelle: req.body.libelle,
        photo_url: process.env.URL_BACK + "/events/pictures/" + req.file.filename,
        user_id: req.userData.id,
        stock: req.body.stock,
        price: req.body.price,
        description: req.body.description,
        category_id: req.body.category_id
    })
        .then(result => {
            res.status(201).send({
                "message": "Plat ajouté à l'évènement !",
                "plat": result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        });
};

// UPDATE plat
const plat_put = async (req, res) => {

    Plat.update({
        category_id: req.body.category_id,
        libelle: req.body.libelle,
        photo_url: process.env.URL_BACK + "/events/pictures/" + req.file.filename,
        stock: req.body.stock,
        price: req.body.price,
        description: req.body.description
    }, { where: { id: req.body.id } })
        .then(() => {
            res.status(200).send({ "message": "Plat mis à jour !" });
        })
        .catch(err => {
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        })
}

// DELETE plat
const plat_delete = async (req, res) => {
    const plat = await Plat.findByPk(req.body.id);
    const img = plat.photo_url.split("/");
    console.log("img name =>", img[5]);
    try {
        fs.unlinkSync(`${process.env.IMAGE_PATH}${img[5]}`); // file removed
    } catch (err) {
        console.error(err)
    }

    Plat.destroy({
        where: {
            id: req.body.id
        }
    })
        .then(plat => {
            res.status(200).send({ "message": "Plat supprimé !", "plat": plat })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ "message": `Une erreur s'est produite ${err}` });
        })
};

module.exports = {
    plat_listing,
    plat_get,
    plat_post,
    plat_put,
    plat_delete
}